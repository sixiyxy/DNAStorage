from .._error import FileParsingError, InvalidFileTypeError, \
        LengthMissmatchError
from warnings import warn

def __split_str(seq, sep='\n'):
    seq = seq.replace("\x0c",sep).strip(sep)
    splt = seq.split(sep, maxsplit=1)
    return splt[0], splt[1].replace(sep, "")

def read_fasta(file_path):
    """Read fasta file into pandas dataframe

    Parameters
    ----------
    file_path : input fasta file
    
    Returns
    -------
    df : pandas dataframe of headers and sequences
         from input fasta file.
    """
    import os
    import pandas as pd
    if not os.path.exists(file_path):
        raise FileNotFoundError("File {0} does not exist: '{0}'".format(file_path))
    elif not os.path.isfile(file_path):
        raise InvalidFileTypeError("File {0} is not of valid type: '{0}'".format(file_path))
    try:
        with open(file_path) as f:
            content = f.read()
            seq_lst = [__split_str(seq, '\n') for seq in content.split('>') if seq.strip('\n')]
        return pd.DataFrame(seq_lst, columns=["Header", "Sequence"])
    except:
        raise FileParsingError("Error occured in parsing file {0}".format(file_path))

def write_fasta(file_path, seq_lst=None, header_lst=None):
    """Write list of sequences and headers to fasta file

    Parameters
    ----------
    file_path : path for output fasta file.
    seq_lst : list of sequences.
    header_lst : list of headers for the sequences.
    
    Returns
    -------
    None
    """
    if not (isinstance(seq_lst, list) and isinstance(header_lst, list)):
        raise ValueError("Sequence and header must be of type list")

    if len(seq_lst) != len(header_lst):
        raise LengthMissmatchError("Sequence and header lists must have same length")

    with open(file_path, 'w') as f:
        for hdr, seq in zip(header_lst, seq_lst):
            hdr_seq = ">{0}\n{1}".format(hdr, seq)
            print(hdr_seq, file=f)

        f.flush()
     
