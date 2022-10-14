import os
from platform import system
from .._error import *
from .._io import read_fasta
from .base import BASE
    
class CD_HIT(BASE):
    """Python wrapper for CD-HIT binary executable from anaconda

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
    
    amino_acid_length_difference_cutoff : int, default=999999
        -S: Length difference cutoff in amino acid.
            If set to 60, the length difference between the shorter sequences
            and the representative of the cluster can not be bigger than 60.
    
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
    CD_HIT_2D
    
    Notes
    -----
    For more details, see CD-HIT user guide, available at
    http://www.bioinformatics.org/cd-hit/cd-hit-user-guide.pdf

    """
    def __init__(self, global_seq_identity= True, band_width= 20, max_memory= 400, word_length= 5,
                 throw_away_sequences_length= 10, tol= 2, desc_length= 20, length_difference_cutoff= 0.0,
                 amino_acid_length_difference_cutoff= 999999, long_seq_alignment_coverage= 0.0,
                 long_seq_alignment_coverage_control= 99999999, short_seq_alignment_coverage= 0.0,
                 short_seq_alignment_coverage_control= 99999999, store_in_RAM= True,
                 print_alignment_overlap= False, nthreads= 1, fast_mode= True):
        args = locals()
        del args['self'], args['__class__']
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

    def __get_command(self, cdhit_exe, fin, fout, threshold):
        return "{0} -i {1} -o {2} -c {3} -G {4} -b {5} -M {6} -n {7} -l {8} -t {9} -d {10} -s {11} -S {12} -aL {13} -AL {14} -aS {15} -AS {16} -B {17} -p {18} -T {19} -g {20}".format(cdhit_exe, fin, fout,
                    threshold, self.global_seq_identity, self.band_width, self.max_memory, self.word_length, self.throw_away_sequences_length, self.tol, self.desc_length, self.length_difference_cutoff, self.amino_acid_length_difference_cutoff, self.long_seq_alignment_coverage, self.long_seq_alignment_coverage_control, self.short_seq_alignment_coverage, self.short_seq_alignment_coverage_control, self.store_in_RAM, self.print_alignment_overlap, self.nthreads, self.fast_mode)
    
    def __call_cdhit(self, cdhit_exec, fin, fout, threshold):
        import subprocess
        command = self.__get_command(cdhit_exec, fin, fout, threshold)
        
        returncode = subprocess.Popen(command, shell=True).wait()
        if returncode != 0:
            raise CdhitCommandError("Error while execution of cd-hit")
        
    def from_file(self, inp_file=None, out_file=None, threshold=0.9):
        """Runs CD-HIT using fasta file with user defined similarity threshold.
        Output is also in form of fasta file.
           
        Parameters
        ----------
        inp_file : (-i) input filename in fasta format.
        out_file : (-o) path to fasta file of representative sequences. 
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
        cdhit_exec = self._get_cdhit_exec(['cd-hit', 'cdhit'])
        #if cdhit_exec:
        print(cdhit_exec)
        self.__call_cdhit(cdhit_exec, inp_file, out_file, threshold)
        

    def from_list(self, seq_lst=None, header_lst=None, threshold=0.9, clstr_file=None, output_fasta_file=None):
        """Runs CD-HIT using sequence and header lists
        with user defined similarity threshold.
        Output is in form of python list object
        and can also export out as fasta file.
           
        Parameters
        ----------
        seq_file : List of sequences.
        header_file : List of headers for sequences.
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
        header : List of header for representative sequences.
        seq : List of representative sequences.
        """
        cdhit_exec = self._get_cdhit_exec(['cd-hit', 'cdhit'])

        if seq_lst is None or header_lst is None:
            raise MissingArgumentError("Both sequence list and header list must be provided")
        
        with self._temp_file() as inp, self._temp_file() as out:
            self._print_to_file(seq_lst, header_lst, inp)

            self.__call_cdhit(cdhit_exec, inp.name, out.name, threshold)

            df = read_fasta(out.name)
            
            if output_fasta_file:
                try:
                    from shutil import copyfile
                except ImportError:
                    from distutils.file_util import copy_file as copyfile

                copyfile(out.name, output_fasta_file)
            
            if self.print_alignment_overlap:
                clstr_file_folder = os.path.dirname(os.path.abspath(clstr_file)) if clstr_file is not None else "None"
                if clstr_file is not None and os.path.exists(clstr_file_folder):
                    try:
                        from shutil import copyfile
                    except ImportError:
                        from distutils.file_util import copy_file as copyfile
                    tmp_clstr_file = out.name+".clstr"
                    copyfile(tmp_clstr_file, clstr_file)
                else:
                    import warnings
                    warnings.warn(" ".join([f"Folder containing clstr file does not exist: {clstr_file_folder}.",
                                    "Ignoring 'print_alignment_overlap' argument."]))

        return df["Header"].tolist(), df["Sequence"].tolist()
