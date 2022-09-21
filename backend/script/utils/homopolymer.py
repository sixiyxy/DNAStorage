
# 默认的均聚物长度对应默认错误概率
def default_error_function(homopolymere_length, base=None):
    """
    Default function to calculate error probabilities based on the length of homopolymers.
    :param homopolymere_length:
    :param base:
    :return: Error probability of the homopolymer.
    """
    if homopolymere_length < 3:
        return 0
    elif homopolymere_length < 4:
        return 0.3
    elif homopolymere_length < 5:
        return 0.6
    elif homopolymere_length < 6:
        return 0.9
    else:
        return 1.0


def create_result(startpos, endpos, errorprob, i):
    """
    Creates a dictionary containing all results.
    :param startpos:
    :param endpos:
    :param errorprob:
    :param i:
    :return:
    """
    res = dict()
    res['startpos'] = startpos
    res['endpos'] = endpos
    res['errorprob'] = errorprob
    res['identifier'] = "homopolymer_" + str(i)
    return res

#返回错误率大于0的均聚物列表；start_pos,end_pose,errorRate,index
def homopolymer(sequence, apply_for=None, error_function=default_error_function):
    """
    Generates a list of dictionarys containing base, startpos, endpos and errorprobability for all homopolymers in
    the given sequence.
    :param sequence:
    :param apply_for:
    :param error_function:
    :return:
    """
    if error_function is None:
        error_function = default_error_function
    result = []
    if apply_for is None:
        apply_for = {'G', 'T', 'A', 'C'}
    try:
        prev_char = sequence[0]
    except:
        print(0)
    curr_start_pos = 0
    length = len(sequence)
    i = 0
    for char_pos in range(1, length):
        if prev_char != sequence[char_pos]:
            error_prob = error_function(char_pos - curr_start_pos) ##根据给定序列的均聚物长度计算错误概率
            if error_prob > 0.0:
                tmp = create_result(curr_start_pos, char_pos - 1, error_prob, i) #错误概率大于0，储存这部分的均聚物
                tmp['base'] = prev_char
                result.append(tmp)
                i += 1
            curr_start_pos = char_pos
            prev_char = sequence[char_pos]
    error_prob = error_function(length - curr_start_pos)
    if error_prob > 0.0:
        tmp = create_result(curr_start_pos, length - 1, error_prob, i)
        tmp['base'] = prev_char
        result.append(tmp)
        i += 1
    return result


if __name__ == "__main__":
    print(homopolymer("AAAAAAAAAACACACTTTTTTTTAAAAAAAAAAA"))
    print(homopolymer("AAAAGGGGGGCGGGGAGCCCTTTTTCGCGCCCCCCGGGGTTTTTT"))
