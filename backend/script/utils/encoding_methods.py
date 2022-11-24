import random
import re
import copy
import os,sys
import math
import numpy
from re import search
from datetime import datetime
from collections import defaultdict
from .utils_basic import Monitor
from .encoding_method_rule import *

def check(sequence, max_homopolymer, max_content):
    if max_homopolymer and not homopolymer(sequence, max_homopolymer):
        return False
    if max_content and not gc_content(sequence, max_content):
        return False

    return True


def homopolymer(sequence, max_homopolymer):
    homopolymers = "A{%d,}|C{%d,}|G{%d,}|T{%d,}" % tuple([1 + max_homopolymer] * 4)
    return False if search(homopolymers, sequence) else True


def gc_content(sequence, max_content):
    return (1 - max_content) <= (float(sequence.count("C") + sequence.count("G")) / float(len(sequence))) <= max_content


class AbstractCodingAlgorithm(object):

    def __init__(self, need_logs=False):
        self.bit_size = None
        self.need_logs = need_logs
        self.monitor = Monitor()
        self.segment_length = None

    def __init_check__(self):
        raise NotImplementedError("\"init_check\" interface needs to be implemented!")

    def silicon_to_carbon(self, bit_segments, bit_size):
        for bit_segment in bit_segments:
            if type(bit_segment) != list or type(bit_segment[0]) != int:
                raise ValueError("The dimension of bit matrix can only be 2!")

        if self.need_logs:
            print("The bit size of the encoded file is " + str(self.bit_size) + " bits and"
                  + " the length of final encoded binary segments is " + str(self.segment_length))

        self.bit_size = bit_size
        self.segment_length = len(bit_segments[0])
        start_time = datetime.now()

        if self.need_logs:
            print("Encode bit segments to DNA sequences by coding scheme.")

        dna_sequences = self.encode(bit_segments)

        encoding_runtime = (datetime.now() - start_time).total_seconds()

        nucleotide_count = 0
        for dna_sequence in dna_sequences:
            nucleotide_count += len(dna_sequence)

        information_density = bit_size / nucleotide_count

        return {"dna": dna_sequences, "i": information_density, "t": encoding_runtime}

    def carbon_to_silicon(self, dna_sequences):

        for dna_sequence in dna_sequences:
            if type(dna_sequence) != list or type(dna_sequence[0]) != str:
                raise ValueError("The dimension of nucleotide matrix can only be 2!")

        start_time = datetime.now()

        if self.need_logs:
            print("Decode DNA sequences to bit segments by coding scheme.")
        bit_segments = self.decode(dna_sequences)

        # for segment_index, bit_segment in enumerate(bit_segments):
            # if len(bit_segment) != segment_length:
                # bit_segments[segment_index] = bit_segment[: segment_length]

        decoding_runtime = (datetime.now() - start_time).total_seconds()

        return {"bit": bit_segments,"t": decoding_runtime}

    def encode(self, bit_segments):
        raise NotImplementedError("\"decode\" interface needs to be implemented!")

    def decode(self, dna_sequences):
        raise NotImplementedError("\"decode\" interface needs to be implemented!")


class BaseCodingAlgorithm(AbstractCodingAlgorithm):

    def __init__(self, need_logs=False):
        super().__init__(need_logs)
        self.mapping_rules = [[0, 0], [0, 1], [1, 0], [1, 1]]

    def __init_check__(self):
        pass

    def encode(self, bit_segments):
        dna_sequences = []

        for segment_index, bit_segment in enumerate(bit_segments):
            dna_sequence = []
            # print(segment_index,len(bit_segment),len(bit_segments))
            if len(bit_segment) % 2 != 0:
                raise ValueError("The length of inputted binary segment must be divided by 2!")

            for position in range(0, len(bit_segment), 2):
                dna_sequence.append(index_base.get(self.mapping_rules.index(bit_segment[position: position + 2])))

            dna_sequences.append(dna_sequence)

            if self.need_logs:
                self.monitor.output(segment_index + 1, len(bit_segments))

        return dna_sequences

    def decode(self, dna_sequences):
        bit_segments = []

        for sequence_index, dna_sequence in enumerate(dna_sequences):
            bit_segment = []
            for nucleotide in dna_sequence:
                bit_segment += self.mapping_rules[base_index.get(nucleotide)]

            bit_segments.append(bit_segment)

            if self.need_logs:
                self.monitor.output(sequence_index + 1, len(dna_sequences))

        return bit_segments


class Church(AbstractCodingAlgorithm):

    def __init__(self, need_logs=False):
        super().__init__(need_logs)
        self.carbon_options = [["A", "C"], ["G", "T"]]

        if self.need_logs:
            print("create Church et al. successfully")
            print("Church, G. M., Gao, Y., & Kosuri, S. (2012). "
                  "Next-generation digital information storage in DNA. "
                  "Science, 337(6102), 1628-1628.")

    def __init_check__(self):
        pass

    def encode(self, bit_segments):
        dna_sequences = []

        for segment_index, bit_segment in enumerate(bit_segments):
            dna_sequence = []
            # print(segment_index,bit_segment)
            for bit in bit_segment:
                options, window = self.carbon_options[bit], dna_sequence[-3:]

                if len(window) == 3 and len(set(window)) == 1:
                    for option in options:
                        if option != window[0]:
                            dna_sequence.append(option)
                            break
                else:
                    dna_sequence.append(random.choice(options))

            dna_sequences.append(dna_sequence)


            if self.need_logs:
                self.monitor.output(segment_index + 1, len(bit_segments))

        return dna_sequences

    def decode(self, dna_sequences):
        bit_segments = []

        for sequence_index, dna_sequence in enumerate(dna_sequences):
            bit_segment = []
            for nucleotide in dna_sequence:
                for option_index, carbon_option in enumerate(self.carbon_options):
                    if nucleotide in carbon_option:
                        bit_segment.append(option_index)

            bit_segments.append(bit_segment)

            if self.need_logs:
                self.monitor.output(sequence_index + 1, len(dna_sequences))

        return bit_segments


class Goldman(AbstractCodingAlgorithm):

    def __init__(self, fixed_huffman=True, support_nucleotide="A", need_logs=False):
        super().__init__(need_logs)
        self.fixed_huffman = fixed_huffman
        self.support_nucleotide = support_nucleotide
        if self.fixed_huffman:
            self.huffman_tree = goldman_dict
        else:
            self.huffman_tree = None
        # print(self.huffman_tree)
        self.__init_check__()

        if self.need_logs:
            print("create Goldman et al. successfully")
            print("Goldman, N., Bertone, P., Chen, S., Dessimoz, C., LeProust, E. M., Sipos, B., & Birney, E. (2013). "
                  "Towards practical, high-capacity, low-maintenance information storage in synthesized DNA. "
                  "Nature, 494(7435), 77-80.")

    def __init_check__(self):
        if self.support_nucleotide not in ["A", "C", "G", "T"]:
            raise ValueError("start nucleotide needs to be one of \"A\", \"C\", \"G\", or \"T\"!")

    def encode(self, bit_segments):
        if not self.fixed_huffman:
            print("In this encoding process, the ternary Huffman tree is "
                  + "generated according to the file. Please keep it properly.")
            self.huffman_tree = self.adaptive_huffman_tree(bit_segments, 3)
            # print(self.huffman_tree)

        dna_sequences = []
        # print(len(bit_segments))
        for segment_index, bit_segment in enumerate(bit_segments):

            if not self.fixed_huffman and len(bit_segment) < 24:
                raise ValueError("length of bit segment must greater than or equal to 24!")

            dna_sequence = []

            if len(bit_segment) % 8 != 0:
                raise ValueError("The length of inputted binary segment must be divided by 8!")

            ternary_segment = []
            for position in range(0, len(bit_segment), 8):
                current_number = int("".join(list(map(str, bit_segment[position: position + 8]))), 2)
                # print('cur',current_number)
                # print(self.huffman_tree,len(self.huffman_tree))
                huffman_code = self.huffman_tree[current_number]
                # print('huff',huffman_code)
                for code_index in range(len(huffman_code)):
                    ternary_segment.append(int(huffman_code[code_index]))


            last_nucleotide = self.support_nucleotide
            for value in ternary_segment:
                current_base = rotate_codes.get(last_nucleotide)[value]
                dna_sequence.append(current_base)
                last_nucleotide = current_base
            dna_sequences.append(dna_sequence)


            if self.need_logs:
                self.monitor.output(segment_index + 1, len(bit_segments))

        return dna_sequences

    def decode(self, dna_sequences):
        if self.huffman_tree is None:
            raise ValueError("The Ternary Huffman tree need to be pre-declared!")

        bit_segments = []

        for sequence_index, dna_sequence in enumerate(dna_sequences):
            try:
                last_nucleotide, ternary_segment = self.support_nucleotide, []
                for nucleotide in dna_sequence:
                    ternary_segment.append(rotate_codes.get(last_nucleotide).index(nucleotide))
                    last_nucleotide = nucleotide

                temp_ternary, bit_segment = "", []
                
                for value in ternary_segment:
                    temp_ternary += str(value)
                    if temp_ternary in self.huffman_tree:
                        tree_index = self.huffman_tree.index(temp_ternary)
                        bit_segment += list(map(int, list(str(bin(tree_index))[2:].zfill(8))))
                        temp_ternary = ""

                bit_segments.append(bit_segment)
            except ValueError:
                pass

            if self.need_logs:
                self.monitor.output(sequence_index + 1, len(dna_sequences))

        return bit_segments

    def adaptive_huffman_tree(self, bit_matrix, size=None, multiple=3):
        """
        introduction: Customize Huffman tree based on the bit matrix.

        :param bit_matrix: Bit matrix, containing only 0,1.
                            Type: Two-dimensional list(int)

        :param size: File size corresponding to the matrix.

        :param multiple: Number of branches constructed (decimal semi-octets).

        :return tree: Byte-based (256) Huffman tree.
        """
        if size is None:
            size = len(bit_matrix) * len(bit_matrix[0])

        print(len(bit_matrix),len(bit_matrix[0]),size)

        # Replace the bit matrix with one-dimensional decimal byte list
        decimal_list = self._get_decimal_list(bit_matrix, size)

        # Store elements and their weights, their codes
        weight, code = {}, {}
        # Recorder, prepare for the following screening of valid keys
        _node = lambda i: "_" + str(i).zfill(3)
        print(_node)
        for one_byte in decimal_list:
            # Create weight values for each element
            if _node(one_byte) in weight:
                weight[_node(one_byte)] += 1
            else:
                # Set the initial value of the code
                print(one_byte,_node(one_byte))
                code[_node(one_byte)] = ""
                weight[_node(one_byte)] = 1

        print(weight)
        for one_byte in range(1, multiple - 1):
            # Add impossible elements to ensure normal combination and close as one element
            if (len(weight) - 1) % (multiple - 1) == 0:
                break
            else:
                weight["_" * one_byte] = 0
        weight_list = list(weight.items())
        print(weight_list)
        print((len(weight) - 1) // (multiple - 1))

        for index in range(0, (len(weight) - 1) // (multiple - 1)):
            weight_list = sorted(weight_list, key=lambda x: x[0])
            print(weight_list)
            weight_list = sorted(weight_list, key=lambda x: x[1])
            print(weight_list)
            # Combine the previous terms into one term
            item = str(index).zfill(3)
            weight = 0
            # Add Huffman coding and form new combinations
            for branch in range(0, multiple):
                item += weight_list[branch][0]
                weight += weight_list[branch][1]
                # Add headers to each item of the previous items.
                for index_item in re.findall(r"_\d{3}", weight_list[branch][0]):
                    code[index_item] = str(multiple - branch - 1) + code[index_item]
            new = [(item, weight)]
            weight_list = weight_list[multiple:] + new

        # noinspection PyTypeChecker
        dictionary = dict([int(key[1:]), value] for key, value in code.items())

        tree = []
        for index in range(256):
            tree.append(dictionary.get(index))

        print(tree,len(tree))
        return tree

    @staticmethod
    def _get_decimal_list(bit_matrix, size):
        """
        introduction: Decimal list generated by the bit matrix.

        :param bit_matrix: Bit matrix, containing only 0,1.
                            Type: Two-dimensional list(int)

        :param size: File size corresponding to the matrix.

        :return decimal_list: Decimal list.
                              Type: One-dimensional list(int)
        """
        bit_index, temp_byte, decimal_list = 0, 0, []
        for row in range(len(bit_matrix)):
            for col in range(len(bit_matrix[0])):
                bit_index += 1
                temp_byte *= 2

                temp_byte += bit_matrix[row][col]
                if bit_index == 8:
                    if size >= 0:
                        print(bit_matrix[row])
                        print(temp_byte)
                        decimal_list.append(int(temp_byte))
                        print(decimal_list)
                        size -= 1
                    bit_index, temp_byte = 0, 0

        return decimal_list


class Grass(AbstractCodingAlgorithm):

    def __init__(self, base_values=None, need_logs=False):
        super().__init__(need_logs)
        self.base_values = base_values
        self.mapping_rules = [[], []]

        self.__init_check__()

        if need_logs:
            print("create Grass et al. successfully")
            print("Grass, R. N., Heckel, R., Puddu, M., Paunescu, D., & Stark, W. J. (2015). "
                  "Robust chemical preservation of digital information on DNA in silica with error-correcting codes. "
                  "Angewandte Chemie International Edition, 54(8), 2552-2555.")

    def __init_check__(self):
        if self.base_values is None:
            self.base_values = [index for index in range(48)]
        else:
            counts = [0 for _ in range(48)]
            for index, value in enumerate(self.base_values):
                if type(value) is int and (0 <= value < 47):
                    counts[value] += 1
                else:
                    raise ValueError("type of value in \"base_values\" is wrong!")

            if max(counts) != 1 or min(counts) != 1:
                raise ValueError("type of value in \"base_values\" is wrong!")

        for index, value in enumerate(self.base_values):
            if 0 <= self.base_values[index] < 47:
                self.mapping_rules[0].append(gc_codes[index])
                self.mapping_rules[1].append(value)

    def encode(self, bit_segments):
        dna_sequences = []

        for segment_index, bit_segment in enumerate(bit_segments):
            dna_sequence = []

            if len(bit_segment) % 16 != 0:
                raise ValueError("The length of inputted binary segment must be divided by 16!")

            for position in range(0, len(bit_segment), 16):
                decimal_number = int("".join(list(map(str, bit_segment[position: position + 16]))), 2)

                rule_indices = []
                for index in range(3):
                    rule_indices.append(decimal_number % 47)
                    decimal_number -= rule_indices[-1]
                    decimal_number /= 47

                rule_indices = rule_indices[::-1]
                for rule_index in rule_indices:
                    dna_sequence += self.mapping_rules[0][self.mapping_rules[1].index(rule_index)]

            dna_sequences.append(dna_sequence)

            if self.need_logs:
                self.monitor.output(segment_index + 1, len(bit_segments))

        return dna_sequences

    def decode(self, dna_sequences):
        bit_segments = []

        for sequence_index, dna_sequence in enumerate(dna_sequences):
            try:
                bit_segment = []
                for position in range(0, len(dna_sequence), 9):
                    decimal_number, carbon_piece = 0, dna_sequence[position: position + 9]
                    for index in [0, 3, 6]:
                        position = self.mapping_rules[0].index("".join(carbon_piece[index: index + 3]))
                        value = self.mapping_rules[1][position]
                        decimal_number = decimal_number * 47 + value

                    bit_segment += list(map(int, list(str(bin(decimal_number))[2:].zfill(16))))

                bit_segments.append(bit_segment)
            except ValueError:
                pass
            except IndexError:
                pass

            if self.need_logs:
                self.monitor.output(sequence_index + 1, len(dna_sequences))

        return bit_segments


class Blawat(AbstractCodingAlgorithm):

    def __init__(self, need_logs=False):
        super().__init__(need_logs)
        self.first_3 = [[0, 0], [0, 1], [1, 0], [1, 1]]
        self.last_2 = {
            str([0, 0]): ["AA", "CC", "GG", "TT"],
            str([0, 1]): ["AC", "CG", "GT", "TA"],
            str([1, 0]): ["AG", "CT", "GA", "TC"],
            str([1, 1]): ["AT", "CA", "GC", "TG"],
        }
        self.__init_check__()

        if self.need_logs:
            print("create Blawat et al. successfully!")
            print("Blawat, M., Gaedke, K., Huetter, I., Chen, X. M., Turczyk, B., ... & Church, G. M. (2016). "
                  "Forward error correction for DNA data storage. "
                  "Procedia Computer Science, 80, 1011-1022.")

    def __init_check__(self):
        pass

    def encode(self, bit_segments):
        dna_sequences = []

        for segment_index, bit_segment in enumerate(bit_segments):
            dna_sequence = []

            if len(bit_segment) % 8 != 0:
                raise ValueError("The length of inputted binary segment must be divided by 8!")

            for position in range(0, len(bit_segment), 8):
                carbon_piece, silicon_piece = [None] * 5, bit_segment[position: position + 8]
                for index, carbon_position in zip([0, 2, 4], [0, 1, 3]):
                    carbon_piece[carbon_position] = index_base.get(self.first_3.index(silicon_piece[index: index + 2]))

                for last_2_option in self.last_2.get(str(silicon_piece[6: 8])):
                    carbon_piece[2], carbon_piece[4] = last_2_option[0], last_2_option[1]
                    if len(set(carbon_piece[:3])) > 1 and len(set(carbon_piece[3:])) > 1:
                        break

                dna_sequence += carbon_piece

            dna_sequences.append(dna_sequence)

            if self.need_logs:
                self.monitor.output(segment_index + 1, len(bit_segments))

        return dna_sequences

    def decode(self, dna_sequences):
        bit_segments = []

        for sequence_index, dna_sequence in enumerate(dna_sequences):
            bit_segment = []
            for position in range(0, len(dna_sequence), 5):
                carbon_piece, silicon_piece = dna_sequence[position: position + 5], []
                for index in [0, 1, 3]:
                    silicon_piece += self.first_3[base_index.get(carbon_piece[index])]

                combination = carbon_piece[2] + carbon_piece[4]
                for value, options in self.last_2.items():
                    if combination in options:
                        silicon_piece += [int(value[1]), int(value[4])]

                bit_segment += silicon_piece

            bit_segments.append(bit_segment)

            if self.need_logs:
                self.monitor.output(sequence_index + 1, len(dna_sequences))

        return bit_segments


class DNAFountain(AbstractCodingAlgorithm):

    def __init__(self, homopolymer=4, gc_bias=0.2, redundancy=0.07, header_size=4,
                 c_dist=0.1, delta=0.05, recursion_depth=10000000, decode_packets=None, need_pre_check=False,
                 need_logs=False):
        super().__init__(need_logs)
        self.homopolymer = homopolymer
        self.gc_bias = gc_bias
        self.redundancy = redundancy
        self.header_size = header_size
        self.c_dist = c_dist
        self.delta = delta
        self.recursion_depth = recursion_depth
        self.need_pre_check = need_pre_check
        self.prng = None
        self.decode_packets = decode_packets
        # adjust the maximum recursion depth to "self.recursion_depth" in Python.
        sys.setrecursionlimit(self.recursion_depth)

        self.__init_check__()

        if self.need_logs:
            print("Create DNA Fountain successfully")
            print("Erlich, Y., & Zielinski, D. (2017). "
                  "DNA Fountain enables a robust and efficient storage architecture. "
                  "Science, 355(6328), 950-954.")

    def __init_check__(self):
        if self.redundancy <= 0:
            raise ValueError("The parameter \"max_redundancy\" is wrong, it is greater than 0!")

        if self.header_size < 0:
            raise ValueError("The parameter \"header_size\" is wrong, it is greater than or equal to 0!")

        if self.gc_bias < 0 or self.gc_bias > 0.5:
            raise ValueError("The parameter \"gc_bias\" is wrong, it is in the range of [0, 0.5]!")

    def encode(self, bit_segments):
        for segment_index, bit_segment in enumerate(bit_segments):
            if len(bit_segment) % 2 != 0:
                try:
                    bit_segments[segment_index] = [0] + bit_segment
                except:
                    # print(bit_segment,len(bit_segment))
                    raise ValueError("xxxx")


        self.decode_packets = len(bit_segments)

        dna_sequences = []
        # final_count = math.ceil(len(bit_segments) * (1 + self.redundancy))
        final_count = math.ceil(len(bit_segments) * (1 + 0))


        # things related to random number generator, starting an lfsr with a certain state and a polynomial for 32bits.
        lfsr = DNAFountain.LFSR().lfsr_s_p()
        # create the solition distribution object
        self.prng = DNAFountain.PRNG(number=self.decode_packets, delta=self.delta, c=self.c_dist)

        used_seeds = dict()
        chuck_recorder = []
        while len(dna_sequences) < final_count:
            seed = next(lfsr)
            if seed in used_seeds:
                continue

            # initialize droplet and trans-code to DNA.
            droplet = DNAFountain.Droplet()
            dna_sequence = droplet.get_dna(seed, self.prng, bit_segments, self.header_size)

            # check validity.
            if check("".join(dna_sequence),
                            max_homopolymer=self.homopolymer, max_content=0.5 + self.gc_bias):
                dna_sequences.append(dna_sequence)
                chuck_recorder.append(droplet.chuck_indices)

            if self.need_logs:
                self.monitor.output(len(dna_sequences), final_count)

        # pre-check the decoding process in the encoding process
        if self.need_pre_check:
            try:
                visited_indices = [0] * self.decode_packets
                for chuck_indices in chuck_recorder:
                    for chuck_index in chuck_indices:
                        visited_indices[chuck_index] += 1
                if 0 in visited_indices:
                    no_visit_indices = []
                    for index, visited in enumerate(visited_indices):
                        if visited == 0:
                            no_visit_indices.append(index)
                    raise ValueError("bit segment " + str(no_visit_indices) + " are not been encoded!")
                if self.need_logs:
                    print("Pre-check the decoding process.")
                self.decode(dna_sequences)
            except ValueError:
                raise ValueError("Based on the pre decoding operation, "
                                 "it is found that the encoded data does not meet the full rank condition."
                                 "Please increase \"redundancy\" or use compression to "
                                 "change the original digital data.")
        else:
            if self.need_logs:
                print("We recommend that you test whether it can be decoded before starting the wet experiment.")

        return dna_sequences

    def decode(self, dna_sequences):
        if self.decode_packets is None:
            raise ValueError("We miss the parameter \"decode_packets\", "
                             + "please try again after inputting this parameter.")

        # creating the solition distribution object
        self.prng = DNAFountain.PRNG(number=self.decode_packets, delta=self.delta, c=self.c_dist)

        bit_segments = [[1]] * self.decode_packets
        done_segments = set()
        chunk_to_droplets = defaultdict(set)

        for dna_sequence in dna_sequences:
            droplet = DNAFountain.Droplet()
            droplet.init_binaries(self.prng, dna_sequence, self.header_size)

            for chunk_num in droplet.chuck_indices:
                chunk_to_droplets[chunk_num].add(droplet)

            self.update_droplets(droplet, bit_segments, done_segments, chunk_to_droplets)

            if self.need_logs:
                self.monitor.output(len(done_segments), self.decode_packets)

            if len(done_segments) == self.decode_packets:
                break

        # if None in bit_segments or self.decode_packets - len(done_segments) > 0:
        #     raise ValueError("Couldn't decode the whole file, because some bit segments are not recovered!")

        return bit_segments

    def update_droplets(self, droplet, bit_segments, done_segments, chunk_to_droplets):
        for chunk_index in (set(droplet.chuck_indices) & done_segments):
            droplet.update_binaries(chunk_index, bit_segments)
            # cut the edge between droplet and input segment.
            chunk_to_droplets[chunk_index].discard(droplet)

        if len(droplet.chuck_indices) == 1:
            # the droplet has only one input segment
            lone_chunk = droplet.chuck_indices.pop()
            # assign the droplet value to the input segment (=entry[0][0])
            bit_segments[lone_chunk] = droplet.payload
            # add the lone_chunk to a data structure of done segments.
            done_segments.add(lone_chunk)
            # cut the edge between the input segment and the droplet
            chunk_to_droplets[lone_chunk].discard(droplet)
            # update other droplets
            for other_droplet in chunk_to_droplets[lone_chunk].copy():
                self.update_droplets(other_droplet, bit_segments, done_segments, chunk_to_droplets)

    class Droplet(object):

        def __init__(self):
            self.seed = None
            self.payload = None
            self.chuck_indices = None

        def get_dna(self, seed, prng, bit_segments, header_size):
            self.seed = seed
            self.payload = None
            self.chuck_indices = prng.get_src_blocks_wrap(seed)

            for chuck_index in self.chuck_indices:
                if self.payload is None:
                    self.payload = bit_segments[chuck_index]
                else:
                    self.payload = list(map(self.xor, self.payload, bit_segments[chuck_index]))
            # print(self.payload,len(self.payload),chuck_index)
            bit_list = self._get_seed_list(header_size) + self.payload

            dna_sequence = []
            for index in range(0, len(bit_list), 2):
                dna_sequence.append(index_base.get(bit_list[index] * 2 + bit_list[index + 1]))
            # print(dna_sequence,len(dna_sequence))
            return dna_sequence

        def init_binaries(self, prng, dna_sequence, header_size):
            # recover the bit segment
            bit_segment = []
            for base in dna_sequence:
                index = base_index.get(base)
                bit_segment.append(int(index / 2))
                bit_segment.append(index % 2)

            self.seed = self.get_seed(bit_segment[:header_size * 8])
            self.payload = bit_segment[header_size * 8:]
            self.chuck_indices = prng.get_src_blocks_wrap(self.seed)

        def update_binaries(self, chunk_index, bit_segments):
            self.payload = list(map(self.xor, self.payload, bit_segments[chunk_index]))
            # subtract (ie. xor) the value of the solved segment from the droplet.
            self.chuck_indices.remove(chunk_index)

        def _get_seed_list(self, header_size):
            seed_list = [0 for _ in range(header_size * 8)]
            temp_seed = self.seed
            for index in range(len(seed_list)):
                seed_list[index] = temp_seed % 2
                temp_seed = int((temp_seed - seed_list[index]) / 2)
            return seed_list

        @staticmethod
        def get_seed(seed_list):
            seed = 0
            for value in seed_list[::-1]:
                seed = seed * 2 + value

            return seed

        @staticmethod
        def xor(value_1, value_2):
            return value_1 ^ value_2

    class PRNG(object):

        def __init__(self, number, delta, c):
            self.number = number
            self.delta = delta
            self.c = c
            self.value = self.c * math.log(self.number / self.delta) * math.sqrt(self.number)
            self.cdf, self.degree = self.gen_rsd_cdf(number, self.value, self.delta)

        def get_src_blocks_wrap(self, seed):
            random.seed(seed)
            p = random.random()
            d = self._sample_degree(p)
            return random.sample(range(int(self.number)), d)

        @staticmethod
        def gen_rsd_cdf(number, value, delta):
            pivot = int(math.floor(number / value))
            value_1 = [value / number * 1 / d for d in range(1, pivot)]
            value_2 = [value / number * math.log(value / delta)]
            value_3 = [0 for _ in range(pivot, number)]
            tau = value_1 + value_2 + value_3
            rho = [1.0 / number] + [1.0 / (d * (d - 1)) for d in range(2, number + 1)]
            degree = sum(rho) + sum(tau)
            mu = [(rho[d] + tau[d]) / degree for d in range(number)]
            cdf = numpy.cumsum(mu)
            return cdf, degree

        def _sample_degree(self, p):
            index = None
            for index, value in enumerate(self.cdf):
                if value > p:
                    return index + 1
            return index + 1

    class LFSR(object):

        def __init__(self):
            pass

        @staticmethod
        def lfsr(state, mask):
            result = state
            nbits = mask.bit_length() - 1
            while True:
                result = result << 1
                xor = result >> nbits
                if xor != 0:
                    result ^= mask
                yield result

        @staticmethod
        def lfsr32p():
            return 0b100000000000000000000000011000101

        @staticmethod
        def lfsr32s():
            return 0b001010101

        def lfsr_s_p(self):
            return self.lfsr(self.lfsr32s(), self.lfsr32p())



class YinYangCode(AbstractCodingAlgorithm):

    def __init__(self, yang_rule=None, yin_rule=None, virtual_nucleotide="A", 
                    max_iterations=1000,
                 max_ratio=0.8, faster=True, max_homopolymer=4, 
                 max_content=0.6,index_length=0, need_logs=False):
        super().__init__(need_logs)

        if not yang_rule:
            yang_rule = [0, 1, 0, 1]
        if not yin_rule:
            yin_rule = [[1, 1, 0, 0], [1, 0, 0, 1], [1, 1, 0, 0], [1, 1, 0, 0]]

        self.yang_rule = yang_rule
        self.yin_rule = yin_rule
        self.virtual_nucleotide = virtual_nucleotide
        self.max_iterations = max_iterations
        self.max_homopolymer = max_homopolymer
        self.max_content = max_content
        self.max_ratio = max_ratio
        self.faster = faster
        self.index_length = index_length
        self.total_count = 10000

        self.__init_check__()

        if self.need_logs:
            print("Create Yin-Yang Code successfully")

    def __init_check__(self):
        if self.virtual_nucleotide not in ["A", "C", "G", "T"]:
            raise ValueError("Virtual nucleotide needs to be one of \"A\", \"C\", \"G\", or \"T\"!")

        # Check Yang rule (rule 1)
        if sum(self.yang_rule) != 2:
            raise ValueError("Wrong correspondence between base and binary data!")
        for index, value in enumerate(self.yang_rule):
            if type(value) != int and (value != 0 and value != 1):
                raise ValueError("Only 0 and 1 can be included for base reference, and yang rule[" + str(index)
                                 + "] has been detected as " + str(value) + "!")

        # Check Yin rule (rule 2)
        if self.yang_rule[0] == self.yang_rule[1]:
            same = [0, 1, 2, 3]
        elif self.yang_rule[0] == self.yang_rule[2]:
            same = [0, 2, 1, 3]
        else:
            same = [0, 3, 1, 2]

        for index in range(len(self.yin_rule)):
            if self.yin_rule[index][same[0]] + self.yin_rule[index][same[1]] != 1 \
                    or self.yin_rule[index][same[0]] * self.yin_rule[index][same[1]] != 0:
                raise ValueError("Wrong yin rule, the error locations are ["
                                 + str(index) + ", " + str(same[0]) + "] and ["
                                 + str(index) + ", " + str(same[1]) + "]! "
                                 + "It is required by rule that these two values will have sum of 1 and product of 0.")
            if self.yin_rule[index][same[2]] + self.yin_rule[index][same[3]] != 1 \
                    or self.yin_rule[index][same[2]] * self.yin_rule[index][same[3]] != 0:
                raise ValueError("Wrong yin rule, the error locations are ["
                                 + str(index) + ", " + str(same[2]) + "] and ["
                                 + str(index) + ", " + str(same[3]) + "]! "
                                 + "It is required by rule that these two values will have sum of 1 and product of 0.")

    def encode(self, bit_segments):
        self.index_length = int(len(str(bin(len(bit_segments)))) - 2)
        self.total_count = len(bit_segments)

        result = self.jlk_encode(bit_segments)
       

        return result

    def normal_encode(self, bit_segments):
        dna_sequences = []
        if self.need_logs:
            print("Separate \'good\' binary segments from \'bad\' binary segments.")

        bad_data = []
        for row in range(len(bit_segments)):
            if numpy.sum(bit_segments[row]) > len(bit_segments[row]) * self.max_ratio \
                    or numpy.sum(bit_segments[row]) < len(bit_segments[row]) * (1 - self.max_ratio):
                bad_data.append(row)
        print('### bad ',len(bad_data))

        if len(bit_segments) < len(bad_data) * 5:
            if self.need_logs:
                print("There may be a large number of sequences that are difficult for synthesis or sequencing. "
                      + "We recommend you to re-select the rule or take a new run.")

        if len(bad_data) == 0 and len(bit_segments) == 0:
            return []
        elif len(bad_data) == 0:
            good_data, band_data = [], []
            for row in range(len(bit_segments)):
                if self.need_logs:
                    self.monitor.output(row + 1, len(bit_segments))
                good_data.append(bit_segments[row])
        elif len(bad_data) == len(bit_segments):
            good_data, bad_data = [], []
            for row in range(len(bit_segments)):
                if self.need_logs:
                    self.monitor.output(row + 1, len(bit_segments))
                bad_data.append(bit_segments[row])
        else:
            x, y = [], []
            for row in range(len(bit_segments)):
                if self.need_logs:
                    self.monitor.output(row + 1, len(bit_segments))
                if row in bad_data:
                    y.append(bit_segments[row])
                else:
                    x.append(bit_segments[row])
            good_data, bad_data = x, y

        print('###',len(good_data),len(bad_data))
        if self.need_logs:
            print("Encode based on random pair iteration.")

        while len(good_data) + len(bad_data) > 0:
            if len(good_data) > 0 and len(bad_data) > 0:
                fixed_bit_segment, is_finish, state = good_data.pop(), False, True
            elif len(good_data) > 0:
                fixed_bit_segment, is_finish, state = good_data.pop(), False, False
            elif len(bad_data) > 0:
                fixed_bit_segment, is_finish, state = bad_data.pop(), False, True
            else:
                raise ValueError("Wrong pairing for Yin-Yang Code!")

            for pair_time in range(self.max_iterations):
                if state:
                    if len(bad_data) > 0:
                        selected_index = random.randint(0, len(bad_data) - 1)
                        selected_bit_segment = bad_data[selected_index]
                    else:
                        break
                else:
                    if len(good_data) > 0:
                        selected_index = random.randint(0, len(good_data) - 1)
                        selected_bit_segment = good_data[selected_index]
                    else:
                        break

                dna_sequence = [[], []]
                support_nucleotide_1 = self.virtual_nucleotide
                support_nucleotide_2 = self.virtual_nucleotide
                for bit_1, bit_2 in zip(fixed_bit_segment, selected_bit_segment):
                    current_nucleotide_1 = self._bits_to_nucleotide(bit_1, bit_2, support_nucleotide_1)
                    current_nucleotide_2 = self._bits_to_nucleotide(bit_2, bit_1, support_nucleotide_2)
                    dna_sequence[0].append(current_nucleotide_1)
                    dna_sequence[1].append(current_nucleotide_2)
                    support_nucleotide_1 = current_nucleotide_1
                    support_nucleotide_2 = current_nucleotide_2

                if check("".join(dna_sequence[0]),
                                max_homopolymer=self.max_homopolymer, max_content=self.max_content):
                    is_finish = True
                    dna_sequences.append(dna_sequence[0])
                    if state:
                        del bad_data[selected_index]
                    else:
                        del good_data[selected_index]
                    break
                elif check("".join(dna_sequence[1]),
                                  max_homopolymer=self.max_homopolymer, max_content=self.max_content):
                    is_finish = True
                    dna_sequences.append(dna_sequence[1])
                    if state:
                        del bad_data[selected_index]
                    else:
                        del good_data[selected_index]
                    break

            # additional information
            if not is_finish:
                dna_sequences.append(self.addition(fixed_bit_segment, self.total_count))

            if self.need_logs:
                self.monitor.output(self.total_count - (len(good_data) + len(bad_data)), self.total_count)

        return dna_sequences

    def faster_encode(self, bit_segments):
        if self.need_logs:
            print("Faster setting may increases the number of additional binary segments "
                  + "(3 ~ 4 times than that of normal setting).")

        dna_sequences = []

        while len(bit_segments) > 0:
            fixed_bit_segment, is_finish = bit_segments.pop(), False
            for pair_time in range(self.max_iterations):
                if len(bit_segments) > 0:
                    selected_index = random.randint(0, len(bit_segments) - 1)
                    selected_bit_segment = bit_segments[selected_index]

                    dna_sequence = [[], []]
                    support_nucleotide_1 = self.virtual_nucleotide
                    support_nucleotide_2 = self.virtual_nucleotide
                    print(fixed_bit_segment)
                    print(selected_bit_segment)
                    print('#',support_nucleotide_1,support_nucleotide_2)
                    for bit_1, bit_2 in zip(fixed_bit_segment, selected_bit_segment):
                        # print(bit_1,bit_2)
                        current_nucleotide_1 = self._bits_to_nucleotide(bit_1, bit_2, support_nucleotide_1)
                        # print('1',current_nucleotide_1)
                        current_nucleotide_2 = self._bits_to_nucleotide(bit_2, bit_1, support_nucleotide_2)
                        # print('2',current_nucleotide_2)
                        dna_sequence[0].append(current_nucleotide_1)
                        dna_sequence[1].append(current_nucleotide_2)
                        support_nucleotide_1 = current_nucleotide_1
                        support_nucleotide_2 = current_nucleotide_2
                    
                    print(dna_sequence)


                    if check("".join(dna_sequence[0]),
                                    max_homopolymer=self.max_homopolymer,
                                    max_content=self.max_content):
                        is_finish = True
                        dna_sequences.append(dna_sequence[0])
                        del bit_segments[selected_index]
                        break
                    elif check("".join(dna_sequence[1]),
                                      max_homopolymer=self.max_homopolymer, max_content=self.max_content):
                        is_finish = True
                        dna_sequences.append(dna_sequence[1])
                        del bit_segments[selected_index]
                        break
                print(pair_time,len(bit_segments),is_finish)
            # additional information
            if not is_finish:
                print('there',self.total_count,self.index_length)
                dna_sequences.append(self.addition(fixed_bit_segment, self.total_count))
                print('has dna')

            if self.need_logs:
                self.monitor.output(self.total_count - len(bit_segments), self.total_count)

        return dna_sequences
    
    def jlk_encode(self, bit_segments):
        if self.need_logs:
            print("Faster setting may increases the number of additional binary segments "
                  + "(3 ~ 4 times than that of normal setting).")

        dna_sequences = []
        copy_bit_segments = copy.deepcopy(bit_segments)

        id = 0
        fail_list = []
        while len(bit_segments) > 0:
            fixed_bit_segment, is_finish = bit_segments.pop(), False
            for pair_time in range(self.max_iterations):
                if len(bit_segments) > 0:
                    selected_index = random.randint(0, len(copy_bit_segments) - 1)
                    selected_bit_segment = copy_bit_segments[selected_index]

                    dna_sequence = []
                    support_nucleotide_1 = self.virtual_nucleotide

                    for bit_1, bit_2 in zip(fixed_bit_segment, selected_bit_segment):
                        current_nucleotide_1 = self._bits_to_nucleotide(bit_1, bit_2, support_nucleotide_1)
                        dna_sequence.append(current_nucleotide_1)
                        support_nucleotide_1 = current_nucleotide_1
                    

                    if check("".join(dna_sequence),
                                    max_homopolymer=self.max_homopolymer,
                                    max_content=self.max_content):
                        is_finish = True
                        dna_sequences.append(dna_sequence)    
                        break
                
            if not is_finish and pair_time == (self.max_iterations-1):
                fail_list.append(id)
                # print('####',pair_time,len(bit_segments),is_finish)
            id += 1
            if self.need_logs:
                self.monitor.output(self.total_count - len(bit_segments), self.total_count)

        # print('bit number, dna number',len(copy_bit_segments),len(dna_sequences))
        # print(fail_list)
        return dna_sequences,fail_list
    

    def decode(self, dna_sequences):
        if self.index_length is None:
            raise ValueError("The parameter \"index_length\" is needed, "
                             + "which is used to eliminate additional random binary segments.")
        if self.total_count is None:
            raise ValueError("The parameter \"total_count\" is needed, "
                             + "which is used to eliminate additional random binary segments.")

        bit_segments = []

        for sequence_index, dna_sequence in enumerate(dna_sequences):
            upper_bit_segment, lower_bit_segment = [], []

            support_nucleotide = self.virtual_nucleotide
            for current_nucleotide in dna_sequence:
                upper_bit = self.yang_rule[base_index[current_nucleotide]]
                lower_bit = self.yin_rule[base_index[support_nucleotide]][base_index[current_nucleotide]]
                upper_bit_segment.append(upper_bit)
                lower_bit_segment.append(lower_bit)
                support_nucleotide = current_nucleotide

            bit_segments.append(upper_bit_segment)
            bit_segments.append(lower_bit_segment)

            if self.need_logs:
                self.monitor.output(sequence_index + 1, len(dna_sequences))

        remain_bit_segments = []
        for bit_segment in bit_segments:
            # print(bit_segment,len(bit_segment),self.index_length)
            # print(bit_segment[:self.index_length])
            segment_index = int("".join(list(map(str, bit_segment[:self.index_length]))), 2)
            if segment_index < self.total_count:
                remain_bit_segments.append(bit_segment)

        return remain_bit_segments

    def addition(self, fixed_bit_segment, total_count):
        while True:
            # insert at least 2 interval.
            random_index = random.randint(total_count + 3, math.pow(2, self.index_length) - 1)
            random_segment = list(map(int, list(str(bin(random_index))[2:].zfill(self.index_length))))
            print(total_count,self.index_length,random_index,random_segment)

            dna_sequence = [[], []]
            support_nucleotide_1 = self.virtual_nucleotide
            support_nucleotide_2 = self.virtual_nucleotide

            for bit_1, bit_2 in zip(fixed_bit_segment[: self.index_length], random_segment):
                current_nucleotide_1 = self._bits_to_nucleotide(bit_1, bit_2, support_nucleotide_1)
                current_nucleotide_2 = self._bits_to_nucleotide(bit_2, bit_1, support_nucleotide_2)
                dna_sequence[0].append(current_nucleotide_1)
                dna_sequence[1].append(current_nucleotide_2)
                support_nucleotide_1 = current_nucleotide_1
                support_nucleotide_2 = current_nucleotide_2

            work_flags = [True, True]
            for fixed_bit in fixed_bit_segment[self.index_length:]:
                current_nucleotide_1, current_nucleotide_2 = None, None
                for bit in [0, 1]:
                    if work_flags[0] and current_nucleotide_1 is None:
                        current_nucleotide_1 = self._bits_to_nucleotide(fixed_bit, bit, support_nucleotide_1)
                        if not check("".join(dna_sequence[0]) + current_nucleotide_1,
                                            max_homopolymer=self.max_homopolymer,
                                            max_content=self.max_content):
                            current_nucleotide_1 = None
                    if work_flags[1] and current_nucleotide_2 is None:
                        current_nucleotide_2 = self._bits_to_nucleotide(bit, fixed_bit, support_nucleotide_2)
                        if not check("".join(dna_sequence[1]) + current_nucleotide_2,
                                            max_homopolymer=self.max_homopolymer,
                                            max_content=self.max_content):
                            current_nucleotide_2 = None

                if current_nucleotide_1 is None:
                    work_flags[0] = False
                    dna_sequence[0] = None
                else:
                    dna_sequence[0].append(current_nucleotide_1)
                    support_nucleotide_1 = current_nucleotide_1

                if current_nucleotide_2 is None:
                    work_flags[1] = False
                    dna_sequence[1] = None
                else:
                    dna_sequence[1].append(current_nucleotide_2)
                    support_nucleotide_2 = current_nucleotide_2

            for potential_dna_sequence in dna_sequence:
                if potential_dna_sequence is not None and check("".join(potential_dna_sequence),
                                                                       max_homopolymer=self.max_homopolymer,
                                                                       max_content=self.max_content):
                    return potential_dna_sequence

    def _bits_to_nucleotide(self, upper_bit, lower_bit, support_nucleotide):

        # yang_rule = [0, 1, 0, 1]
        # yin_rule = [[1, 1, 0, 0], [1, 0, 0, 1], [1, 1, 0, 0], [1, 1, 0, 0]]

        current_options = []
        for index in range(len(self.yang_rule)):
            if self.yang_rule[index] == upper_bit:
                current_options.append(index)
        # base_index = {'A': 0, 'C': 1, 'G': 2, 'T': 3}
        # index_base = {0: 'A', 1: 'C', 2: 'G', 3: 'T'}

        if self.yin_rule[base_index.get(support_nucleotide)][current_options[0]] == lower_bit:
            return index_base[current_options[0]]
        else:
            return index_base[current_options[1]]


#纠错表，字母纠错表
columA={"TAACCG":(True,'a'),"TAAGGC":(True,'b')}
columB={"ATCACG":(True,'c'),"ATGAGC":(True,'d')}
columC={"ATGGAG":(True,'e'),"TACCAC":(True,'f')}
columD={"ATCCGT":(True,'g'),"ATGCCA":(True,'h'),"TAGCGA":(True,'i'),"TAGGCT":(True,'j')}
columE={"ACATCG":(True,'k'),"ACTTGC":(True,'l'),"TCTACG":(True,'m')}
columF={"ACACAC":(True,'n'),"ACTCTG":(True,'o'),"TCAGAG":(True,'p')}
columG={"ACAGGT":(True,'q'),"ACTGCA":(True,'r'),"AGACCT":(True,'s'),"TCTCGT":(True,'t')}
columH={"TCGAAC":(True,'u')}
columI={"ACGACT":(True,'v')}
columJ={"CATTCG":(True,'w')}
columK={"CTACAG":(True,'x')}
columL={"CAACGT":(True,'y')}
columM={"CAGACA":(True,'z')}


eMapDic={"000111":columA,"001011":columB,"001101":columC,"001110":columD,"010011":columE,"010101":columF,
         "010110":columG,"011001":columH,"011010":columI,"100011":columJ,"100101":columK,"100110":columL,
         "101010":columM}

#纠错表，数字纠错表
dcolumA={"TAACCG":(True,'0'),"TAAGGC":(True,'1')}
dcolumB={"ATCACG":(True,'2'),"ATGAGC":(True,'3')}
dcolumC={"ATGGAG":(True,'4'),"TACCAC":(True,'5')}
dcolumD={"ATCCGT":(True,'6'),"ATGCCA":(True,'7'),"TAGCGA":(True,'8'),"TAGGCT":(True,'9')}
dcolumE={}
dcolumF={}
dcolumG={}
dcolumH={}
dcolumI={}
dcolumJ={}
dcolumK={}
dcolumL={}
dcolumM={}
dMapDic={"000111":dcolumA,"001011":dcolumB,"001101":dcolumC,"001110":dcolumD,"010011":dcolumE,"010101":dcolumF,
         "010110":dcolumG,"011001":dcolumH,"011010":dcolumI,"100011":dcolumJ,"100101":dcolumK,"100110":dcolumL,
         "101010":dcolumM}

###########################符号表###################################################################################

scolumA={"TAACCG":(True,'@'),"TAAGGC":(True,'￥')}
scolumB={"ATCACG":(True,'$'),"ATGAGC":(True,',')}
scolumC={"ATGGAG":(True,'*'),"TACCAC":(True,'/')}
scolumD={"ATCCGT":(True,'('),"ATGCCA":(True,':'),"TAGCGA":(True,'\''),"TAGGCT":(True,'[')}
scolumE={"ACATCG":(True,';'),"ACTTGC":(True,'.'),"TCTACG":(True,'\n')}
scolumF={"ACTCTG":(True,'\"'),"TCAGAG":(True,'%')}
scolumG={"ACAGGT":(True,'{'),"ACTGCA":(True,'~'),"AGACCT":(True,'+'),"TCTCGT":(True,'-')}
scolumH={"TCGAAC":(True,'?')}
scolumI={"ACGACT":(True,'!')}
scolumJ={"CATTCG":(True,'&')}
scolumK={"CTACAG":(True,'=')}
scolumL={"CAACGT":(True,'_')}
scolumM={"CAGACA":(True,'#')}

sMapDic={"000111":scolumA,"001011":scolumB,"001101":scolumC,"001110":scolumD,"010011":scolumE,"010101":scolumF,
         "010110":scolumG,"011001":scolumH,"011010":scolumI,"100011":scolumJ,"100101":scolumK,"100110":scolumL,
         "101010":scolumM}


def reOptionv2(line,spcflag,rectiOneBaseError):
    listre = []
    tmpstr = ""
    count1 = 0
    flag = 0
    try:

        # 碱基单元长度不为4，即存在缺失或插入的处理
        if len(line) > 6:  # 对于插入碱基单元的序列，默认从序列前四位截断
            line = line[:6]
            flag = 4
        elif len(line) < 6:  # 对于缺失碱基单元的序列，默认从序列的最后一位进行延长
            line = line + (line[-1] * (6 - len(line)))
            flag = 2
    except:
        raise RepOpitonExcepion
    for i in range(6):
        if line[i] == 'A' or line[i] == 'T':
            tmpstr += "0"
        else:
            tmpstr += "1"
            count1 += 1
    kmin=0
    columstr=""
    rowstr=""
    flag=True

    if spcflag==0 or spcflag==1:#字母表
        for colstr in eMapDic:
            for targe in eMapDic[colstr]:
                kl=countdifferNumber(line,targe)
                if flag==True:
                    flag=False
                    kmin=kl
                    columstr=colstr
                    rowstr=targe
                elif kmin>kl:
                    kmin=kl
                    columstr = colstr
                    rowstr = targe
    elif spcflag==2:#数学表
        for colstr in dMapDic:
            for targe in dMapDic[colstr]:
                kl = countdifferNumber(line, targe)
                if flag==True:
                    flag=False
                    kmin = kl
                    columstr = colstr
                    rowstr = targe
                elif kmin > kl:
                    kmin = kl
                    columstr = colstr
                    rowstr = targe
    else:#符号表
        for colstr in sMapDic:
            for targe in sMapDic[colstr]:
                kl = countdifferNumber(line, targe)
                if flag==True:
                    flag=False
                    kmin = kl
                    columstr = colstr
                    rowstr = targe
                elif kmin > kl:
                    kmin = kl
                    columstr = colstr
                    rowstr = targe
    if kmin<2:
        if kmin==1:
            rectiOneBaseError[0]+=1
        listre.append(flag)
        listre.append((columstr,rowstr))
    else:
        listre.append(flag+1)
        listre.append((columstr, rowstr))
    return listre

#返回字母表里按照优先级最高的字符
def priorityValue_eMap(canlist,fileindexcount,spcflag):
    canChrlist=[] #
    if len(canlist)>2:
        for i in range(1,len(canlist)):
            if canlist[i][0] in eMapDic:
                for keystr in eMapDic[canlist[i][0]].keys():
                    matchflag=re.search(canlist[i][1],keystr,re.M)
                    if matchflag!=None:
                        canChrlist.append(eMapDic[canlist[i][0]][keystr][1])
    else:#正常出错（AT互换或者CG互换检查)
        if canlist[1][0] in eMapDic:
            for keystr in eMapDic[canlist[1][0]].keys():
                if countdifferNumber(canlist[1][1],keystr)<2:#碱基差别在1
                    canChrlist.append(eMapDic[canlist[1][0]][keystr][1])
                    continue
        else:
            canlist[0]=1
            canChrlist.append('f')

    # with open("temporyfile.tf","ab") as TF:
    #     pickle.dump(fileindexcount,TF)
    #     # pickle.dump(canChrlist,TF)
    #     if spcflag == 1:
    #         pickle.dump(1,TF) #表示该字符要大写，纠正的时候要注意将其转为大写字母
    #     else:
    #         pickle.dump(0,TF)
    if len(canChrlist)!=0:
        return canChrlist[0]
    else:
        return 'f'   #字母纠正失败统一返回’f'

#返回数字表里按照优先级最高的字符
def priorityValue_dMap(canlist,fileindexcount,spcflag):
       canChrlist = []  #

       if len(canlist) > 2:
           for i in range(1, len(canlist)):
               if canlist[i][0] in dMapDic:
                   for keystr in dMapDic[canlist[i][0]].keys():
                       matchflag = re.search(canlist[i][1], keystr, re.M)
                       if matchflag != None:
                           canChrlist.append(dMapDic[canlist[i][0]][keystr][1])
       else:  # 正常出错（AT互换或者CG互换检查)
           if canlist[1][0] in dMapDic:
               for keystr in dMapDic[canlist[1][0]].keys():
                   if countdifferNumber(canlist[1][1], keystr) < 2:  # 碱基差别在1
                       canChrlist.append(dMapDic[canlist[1][0]][keystr][1])
                       continue
           else:
               canlist[0] = 1
               canChrlist.append('0')
       if len(canChrlist) != 0:
            return canChrlist[0]
       else:
            return '0' #数字纠正失败都返回'0'

#符号表简单纠错
def priorityValue_sMap(canlist,fileindexcount,spcflag):
    canChrlist = []  #

    if len(canlist)>2:
        for i in range(1,len(canlist)):
            if canlist[i][0] in sMapDic:
                for keystr in sMapDic[canlist[i][0]].keys():
                    matchflag=re.search(canlist[i][1],keystr,re.M)
                    if matchflag!=None:
                        canChrlist.append(sMapDic[canlist[i][0]][keystr][1])
    else:#正常出错（AT互换或者CG互换检查)
        if canlist[1][0] in sMapDic:
            for keystr in sMapDic[canlist[1][0]].keys():
                if countdifferNumber(canlist[1][1],keystr)<2:#碱基差别在1
                    canChrlist.append(sMapDic[canlist[1][0]][keystr][1])
                    continue
        else:
            canlist[0] = 1
            canChrlist.append('.')

    if len(canChrlist) != 0:
        return canChrlist[0]
    else:
        return '.'  # 符号纠正失败都返回'.'

#从候选列表里选择正确的纠正码，根据优先级,并返回对应的字符
def priorityValue(spcflag,candilist,fileindexcount):
    if spcflag==2:#查找数学表
       return priorityValue_dMap(candilist,fileindexcount,spcflag)
    elif spcflag==3:# 查找符号表
       return priorityValue_sMap(candilist,fileindexcount,spcflag)
    else:#查找字母表
        return priorityValue_eMap(candilist,fileindexcount,spcflag)

class RepOpitonExcepion(Exception):
    def __init__(self):
        pass
    def returnInfor(self):
        return "repOptionExcepion"

def getDecodedChar(spcflag,lstr,fileindexcount,rectiOneBaseError):#specflag为1表示cabLock，specflag为2表示Transfer,specflag为0普通

    # with open("temporyfile.tf","ab") as f:#该文件的数据每行第一列为数值表示纠错字符的下标（正文），第二列为解码字符序列，第三列为候选编码列表canlist
        chr="f"
        try:
            canlist=reOptionv2(lstr,spcflag,rectiOneBaseError)
        except RepOpitonExcepion:
            print("reOptionException")
            raise
        if spcflag==0 or spcflag==1:#查找英文字母表
        #查找英文字符表
            if canlist[0]==0 or canlist[0]==2 or canlist[0]==4:#正常译码
                chr = eMapDic[canlist[1][0]][canlist[1][1]][1]
                if spcflag==1:
                    chr=str.upper(chr)
                return chr
            elif canlist[0]==1 or canlist[0]==3 or canlist[0]==5:#纠错译码
                chr= priorityValue(spcflag,canlist,fileindexcount[0])
                if spcflag==1:
                    chr=str.upper(chr)
                return chr
            else:# 无法纠正(四个0或四个1），统一输出字符为‘f'
                chr = priorityValue(spcflag, canlist,fileindexcount[0])
                if spcflag==1:
                    chr=str.upper(chr)
                return 'f'
        elif spcflag==2:#查找数学字符表
            if canlist[0]==0 or canlist[0]==2 or canlist[0]==4:#正常译码
                chr = dMapDic[canlist[1][0]][canlist[1][1]][1]
                return chr
            elif canlist[0]==1 or canlist[0]==3 or canlist[0]==5:#纠错译码
                chr= priorityValue(spcflag,canlist,fileindexcount[0])
                return chr
            else:# 无法纠正(四个0或四个1），统一输出字符为‘f'
                return '0'
        else:#查找符号表
            if canlist[0] == 0 or canlist[0] == 2 or canlist[0] == 4:  # 正常译码
                chr = sMapDic[canlist[1][0]][canlist[1][1]][1]
                return chr
            elif canlist[0] == 1 or canlist[0] == 3 or canlist[0] == 5:  # 纠错译码
                chr = priorityValue(spcflag, canlist,fileindexcount[0])
                return chr
            else:
                return '0'
        return chr;

def countdifferNumber(tmpstr,target):
    k=len(tmpstr)
    l=len(target)
    counter=0
    maxlen=k
    minlen=k
    if k<l:
        maxlen=l
    else:
        minlen=l
    for i in range(minlen):
        if tmpstr[i]!=target[i]:
            counter+=1
    counter+=(maxlen-minlen)
    return counter

#根据碱基序列返回对应的数字编号
def returnNumFromBaseSeq(line,basedict):
      for vt in basedict:
        mcount=countdifferNumber(line,vt)
        if mcount<2:
            return basedict[vt]
      return 0

def  ConvertDNA_to_Inter(lstr):
    unit={"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    decade={"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    hundred={"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    thousand={"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    tenthousand={"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    try:
        p1=returnNumFromBaseSeq(lstr[24:30],unit)
        #块内汉明距离至少为3
        p2=returnNumFromBaseSeq(lstr[18:24],decade)
        p3=returnNumFromBaseSeq(lstr[12:18],hundred)
        p4=returnNumFromBaseSeq(lstr[6:12],thousand)
        p5=returnNumFromBaseSeq(lstr[0:6],tenthousand)
        liestr=""
        liestr+=str(p5)
        liestr+=str(p4)
        liestr+=str(p3)
        liestr+=str(p2)
        liestr+=str(p1)
        return liestr
    except:
        print("ConvertDNA_to_Inter Error")

#判断碱基序列是否是特殊字符（指数字表标识符，空格，大写键标识符，符号表标识符），函数返回值依次为1，2，3，4。其他碱基序列为0
def deterBaseSeqClass(tmpstr):
    if countdifferNumber(tmpstr,"CTTGTC") <2:
        return 1  #数字表标识符
    if countdifferNumber(tmpstr,"CGGTAT") <2:
        return 2  #空格表标识符
    if countdifferNumber(tmpstr,"TGCATA") <2:
        return 3  #大写标识符
    if countdifferNumber(tmpstr,"GTATGA") <2:
        return 4  #符号表标识符
    return 0

class SrcCode():
    def __init__(self):
        self.encodetable = SrcCode_rule()
        self.dna_sequence_length = 180

    def code_num(self,num):
        unit={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        decade={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        hundred={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        thousand={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        tenthousand={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}

        if num>99999:
            return None
        tmpstr=""
        p1=num%10
        p2=num//10%10
        p3=num//100%10
        p4=num//1000%10
        p5=num//10000%10
        tmpstr=tenthousand[p5]+thousand[p4]+hundred[p3]+decade[p2]+unit[p1]
        return tmpstr

    def encodeing(self,file):
        contentlines = file.read()
        original_charater_list = []
        index_ori_charater_list = []
        dna_sequences_list = []

        linenumber = 0
        dna_sequence = ''+self.code_num(linenumber) # first line
        charater_sequence = ''
        for ch in contentlines:
            if ch==' ':#空格
                dna_sequence+="CGGTAT"
                charater_sequence += ch
            elif ch.lower() not in self.encodetable:
                pass
                # original_charater_list.append(ch)
                # dna_sequences_list.append('fail')
                # index_ori_charater_list.append('fail')
                # # print(original_charater_list)
                # # print(dna_sequences_list)
            else:
                if str.isalpha(ch):#字母字符 
                    if str.isupper(ch):#大写字母
                        dna_sequence+="TGCATA"
                    dna_sequence+=self.encodetable[ch.lower()][1]
                    
                elif self.encodetable[ch][0]==2:#数字表
                    dna_sequence+="TGCATA"
                    dna_sequence+=self.encodetable[ch][1]
                else:#符号表
                    dna_sequence+="GTATGA"
                    if ch==")":
                        ch="("
                    if ch=="}":
                        ch="{"
                    if ch=="]":
                        ch="["
                    dna_sequence += self.encodetable[ch][1]
                charater_sequence += ch
                # print(charater_sequence)
                
            if len(dna_sequence)>=self.dna_sequence_length:
                    dna_sequences_list.append(dna_sequence)
                    original_charater_list.append(charater_sequence)
                    index_ori_charater = str(charater_sequence) + str(linenumber)
                    # print(linenumber,str(charater_sequence),index_ori_charater,len(dna_sequence))
                    index_ori_charater_list.append(index_ori_charater)
                    linenumber += 1
                    dna_sequence="" + self.code_num(linenumber)
                    charater_sequence=""
        if len(dna_sequence)<180:
            # print(linenumber)
            dna_sequence+=((180-len(dna_sequence))//6)*"CGGTAT"
            index_ori_charater = str(charater_sequence) + str(linenumber)
            index_ori_charater_list.append(index_ori_charater)
            dna_sequences_list.append(dna_sequence)
            original_charater_list.append(charater_sequence)
        
        # print(len(original_charater_list),len(dna_sequences_list),len(index_ori_charater_list))
        record_data = {'dna_sequences':dna_sequences_list,
                       "original_charater_list":original_charater_list,
                       "index_ori_charater_list": index_ori_charater_list}    
        # print(record_data)
        return record_data
    def decoding(self,dna_sequences):
        char_list = []
        char_index_list = []
        line_num ={"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
        dna_sequences = ['AGACCTAGACCTAGACCTAGACCTAGACCTTGCATATCTCGTATGCCAATGGAGCGGTATTGCATAACTCTGACTTGCATGAGCCGGTATTGCATATCTACGTAACCGACACACCGGTATTGCATATAACCGACACACATGAGCCGGTATTCTCGTATGCCAATGGAGCGGTATTGCATAAGACCT']
        for dna_seq in dna_sequences:
            characters = ''
            line_AGCT = dna_seq[0:30]
            line_AGCT_5 = [line_AGCT[0:6],line_AGCT[6:12],line_AGCT[12:18],line_AGCT[18:24],line_AGCT[24:40]]
            lable = True
            for i in line_AGCT_5:
                if i not in line_num:
                    lable = False
            if lable == False:
                pass
            else:
                fileindexcount=[0]
                rectifyNum=[0]
                linenumber=ConvertDNA_to_Inter(dna_seq[0:30])
                presline=linenumber
                # print(linenumber)
                chr_dna_seq = dna_seq[30:]
                for i in range(0,len(chr_dna_seq),6):
                    tmpstr = chr_dna_seq[i:i+6] 
                    ktype=deterBaseSeqClass(tmpstr)
                    # print(ktype)
                    if ktype == 1:
                        specflag = 2  # 意味着下面的字符要查找数字表
                    elif ktype==4:
                        specflag=3 #意味着下面的字符要查找符号表
                    elif ktype==3:#大写键
                        specflag=1
                    elif ktype==2:#空格
                        chr=' '
                        characters = characters + chr
                        fileindexcount[0] += 1
                    else:
                        specflag =0  
                    
                    chr=getDecodedChar(specflag,tmpstr,fileindexcount,rectifyNum)
                    print('#',chr)
                    characters = characters + chr
                characters = characters + str(linenumber)
                print(characters)
                char_list.append(characters)
        return char_list
            
