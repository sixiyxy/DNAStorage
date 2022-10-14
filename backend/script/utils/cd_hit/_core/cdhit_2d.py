import os
from platform import system
from .._error import *
from .._io import read_fasta
from .base import BASE

class CD_HIT_2D(BASE):
    """Python wrapper for CD-HIT-2D binary executable from anaconda

    Parameters
    ----------
    global_seq_identity : bool, default=True
        -G: Use global sequence identity.
            If set to False, then use local sequence identity, calculated as :
            number of identical amino acids in alignment
            divided by the length of the alignment.
            NOTE!!! don't use global_seq_identity=False unless you use alignment
            coverage controls see options -aL, -AL, -aS, -AS
    
    band_width : int, default=20
        -b: Band_width of alignment.
    
    max_memory : int, default=400
        -M: Max available memory (Mbyte).

    word_length : int, default=5
        -n: word_length
            Choose word length as:
            word_length=5 for thresholds 0.7 ~ 1.0
            word_length=4 for thresholds 0.6 ~ 0.7
            word_length=3 for thresholds 0.5 ~ 0.6
            word_length=2 for thresholds 0.4 ~ 0.5
                 
    throw_away_sequences_length : int, default=10
        -l: Length of throw_away_sequences.
    
    tol : int, default=2
        -t: Tolerance for redundance.
    
    desc_length : int, default=20
        -d: Length of description in .clstr file.
            If set to 0, it takes the fasta defline and stops at first space.
    
    length_difference_cutoff : float, default=0.0
        -s: Length difference cutoff.
            If set to 0.9, the shorter sequences need to be at least 90%
            length of the representative of the cluster.
    
    length_difference_cutoff_2 : float, default=1.0
        -s2: Length difference cutoff for db1.
             By default, seqs in db1 >= seqs in db2 in a same cluster.
             If set to 0.9, seqs in db1 may just >= 90% seqs in db2.
    
    amino_acid_length_difference_cutoff : int, default=999999
        -S: Length difference cutoff in amino acid.
            If set to 60, the length difference between the shorter sequences
            and the representative of the cluster can not be bigger than 60.
    
    amino_acid_length_difference_cutoff_2 : float, default=0
        -S2: Length difference cutoff for db1
             By default, seqs in db1 >= seqs in db2 in a same cluster.
             If set to 0.9, seqs in db1 may just >= 90% seqs in db2.
    
    long_seq_alignment_coverage : float, default=0.0
        -aL: Alignment coverage for the longer sequence.
             If set to 0.9, the alignment must covers 90% of the sequence.
    
    long_seq_alignment_coverage_control : int, default=99999999
        -AL: Alignment coverage control for the longer sequence.
             If set to 60, and the length of the sequence is 400,
             then the alignment must be >= 340 (400-60) residues.
    
    short_seq_alignment_coverage : float, default=0.0
        -aS: Alignment coverage for the shorter sequence.
             If set to 0.9, the alignment must covers 90% of the sequence.
    
    short_seq_alignment_coverage_control : int, default=99999999
        -AS: Alignment coverage control for the shorter sequence.
             If set to 60, and the length of the sequence is 400,
             then the alignment must be >= 340 (400-60) residues.
    
    store_in_RAM : bool, default=True
        -B: Whether to store sequences in RAM
            by default, sequences are stored in RAM.
            If set to False, sequence are stored on hard drive
            it is recommended to use store_in_RAM=False for huge databases.
    
    print_alignment_overlap : bool, default=False
        -p: Print alignment overlap in .clstr file if set to True.
    
    nthreads : int, default=1
        -T: Number of threads
            If nthreads=0, all CPUs will be used.
    
    fast_mode : bool, default=True
        -g: Whether to use fast mode.
            By cd-hit’s default algorithm, a sequence is clustered to the first
            cluster that meet the threshold (fast mode). If set to False, the program
            will cluster it into the most similar cluster that meet the threshold
            (accurate but slow mode).
    
    See also
    --------
    CD-HIT
    
    Notes
    -----
    For more details, see CD-HIT user guide, available at
    http://www.bioinformatics.org/cd-hit/cd-hit-user-guide.pdf

    """

    def __init__(self, global_seq_identity=True, band_width=20, max_memory=400, word_length=5,
                 throw_away_sequences_length=10, tol=2, desc_length=20, length_difference_cutoff=0.0,
                 length_difference_cutoff_2=1.0, amino_acid_length_difference_cutoff=999999,
                 amino_acid_length_difference_cutoff_2=0, long_seq_alignment_coverage=0.0,
                 long_seq_alignment_coverage_control=99999999, short_seq_alignment_coverage=0.0,
                 short_seq_alignment_coverage_control=99999999, store_in_RAM=True,
                 print_alignment_overlap=False, nthreads=1, fast_mode=True):

        super().__init__(global_seq_identity=global_seq_identity,
                         band_width=band_width, max_memory=max_memory,
                         word_length=word_length,
                         throw_away_sequences_length=throw_away_sequences_length,
                         tol=tol,
                         desc_length=desc_length,
                         length_difference_cutoff=length_difference_cutoff,
                         amino_acid_length_difference_cutoff=amino_acid_length_difference_cutoff,
                         long_seq_alignment_coverage=long_seq_alignment_coverage,
                         long_seq_alignment_coverage_control=long_seq_alignment_coverage_control,
                         short_seq_alignment_coverage=short_seq_alignment_coverage,
                         short_seq_alignment_coverage_control=short_seq_alignment_coverage_control,
                         store_in_RAM=store_in_RAM,
                         print_alignment_overlap=print_alignment_overlap,
                         nthreads=nthreads,
                         fast_mode=fast_mode)

        self.length_difference_cutoff_2=length_difference_cutoff_2
        self.amino_acid_length_difference_cutoff_2=amino_acid_length_difference_cutoff_2

    def __get_command(self, cdhit_exe, fin1, fin2, fout, threshold):
        return "{0} -i {1} -i2 {2} -o {3} -c {4} -G {5} -b {6} -M {7} -n {8} -l {9} -t {10} -d {11} -s {12} -s2 {13} -S {14} -S2 {15} -aL {16} -AL {17} -aS {18} -AS {19} -B {20} -p {21} -T {22} -g {23}".format(cdhit_exe, fin1, fin2, fout,threshold, self.global_seq_identity, self.band_width, self.max_memory, self.word_length, self.throw_away_sequences_length, self.tol, self.desc_length, self.length_difference_cutoff, self.length_difference_cutoff_2, self.amino_acid_length_difference_cutoff, self.amino_acid_length_difference_cutoff_2, self.long_seq_alignment_coverage, self.long_seq_alignment_coverage_control, self.short_seq_alignment_coverage, self.short_seq_alignment_coverage_control, self.store_in_RAM, self.print_alignment_overlap, self.nthreads, self.fast_mode)
        
    def __call_cdhit(self, cdhit_exec, fin1, fin2, fout, threshold):
        import subprocess
        command = self.__get_command(cdhit_exec, fin1, fin2, fout, threshold)
        print(command)
        returncode = subprocess.Popen(command, shell=True).wait()
        if returncode != 0:
            raise CdhitCommandError("Error while execution of cd-hit")
        
    def from_file(self, inp_file1=None, inp_file2=None, out_file=None, threshold=0.9):
        """Runs CD-HIT-2D using fasta file with user defined similarity threshold.
        Output is also in form of fasta file.
           
        Parameters
        ----------
        inp_file1 : (-i)input filename for db1 in fasta format.
        inp_file2 : (-i2) input filename for db2 in fasta format.
        out_file : (-o) path to fasta file of sequences in db2 that are not similar to db1. 
        threshold : float, default=0.9
            -c: sequence identity threshold.
                This is the default cd-hit's "global sequence identity"
                calculated as:
                number of identical amino acids in alignment
                divided by the full length of the shorter sequence
        Returns
        -------
        None
        """
        cdhit_exec = self._get_cdhit_exec(['cd-hit-2d'])
        self.__call_cdhit(cdhit_exec, inp_file1, inp_file2, out_file, threshold)

    def from_list(self, seq_lst1=None, header_lst1=None, seq_lst2=None, header_lst2=None, threshold=0.9, output_fasta_file=None):
        """Runs CD-HIT-2D using sequence and header lists
        with user defined similarity threshold.
        Output is in form of puthon list object
        and can also export out as fasta file.
           
        Parameters
        ----------
        seq_file1 : List of sequences for db1.
        header_file1 : List of headers for db1.
        seq_file2 : List of sequences for db2.
        header_file2 : List of headers for db2.
        threshold : float, default=0.9
            -c: sequence identity threshold.
                This is the default cd-hit's "global sequence identity"
                calculated as:
                number of identical amino acids in alignment
                divided by the full length of the shorter sequence
        output_fasta_file : (-o) string or None, default=None
            If set with a file path, then also exports results of CD-HIT-2D
            as a fasta file.
        Returns
        -------
        header : List of header for non similar sequences from db2.
        seq : List of non similar sequences from db2.
        """
        cdhit_exec = self._get_cdhit_exec(['cd-hit-2d'])

        if seq_lst1 is None or header_lst1 is None:
            raise MissingArgumentError("Both sequence list and header list for db1 must be provided")
        if seq_lst2 is None or header_lst2 is None:
            raise MissingArgumentError("Both sequence list and header list for db2 must be provided")
        
        with self._temp_file() as inp1, self._temp_file() as inp2, self._temp_file() as out:
            self._print_to_file(seq_lst1, header_lst1, inp1)
            self._print_to_file(seq_lst2, header_lst2, inp2)

            self.__call_cdhit(cdhit_exec, inp1.name, inp2.name, out.name, threshold)

            df = read_fasta(out.name)
            
            if output_fasta_file:
                try:
                    from shutil import copyfile
                except ImportError:
                    from distutils.file_util import copy_file as copyfile

                copyfile(out.name, output_fasta_file)
                    
        return df["Header"].tolist(), df["Sequence"].tolist()
