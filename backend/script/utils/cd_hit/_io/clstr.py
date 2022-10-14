import numpy as np
import pandas as pd

def __get_similarity_details(line):
    line = line.split('\t')[1]
    line = line.split('aa, ')
    seq_len = line[0]
    if line[1][-1] == "*":
        seq_header = line[1].split(' ')[0]
        seq_header = seq_header.replace("...","")[1:]
        return [int(seq_len), seq_header, np.nan, np.nan, np.nan, np.nan, np.nan]
    else:
        remaining = line[1].split('/')
        similarity = remaining[1]
        remaining = remaining[0]
        seq_header, matching = remaining.split(' at ')
        seq_header = seq_header.replace("...","")[1:]
        seq_strt_idx, seq_end_idx, ref_strt_idx, ref_end_idx = matching.split(':')
        return [int(seq_len), seq_header, int(seq_strt_idx),
                int(seq_end_idx), int(ref_strt_idx), int(ref_end_idx), similarity]

def __parse_cluster(clstr):
    cluster_num = clstr[0]
    cluster = clstr[1:]
    return [[cluster_num]+__get_similarity_details(elem) for elem in cluster]


def parse_clstr_file(path):
    with open(path,"r") as f:
        txt = f.read()
    
    cluster_txt = txt.split('\n>')
    cluster_df = []
    for cluster in cluster_txt:
        cluster = cluster.strip('>').strip('\n').split('\n')
        cluster_df.extend(__parse_cluster(cluster))

    cluster_df = pd.DataFrame(cluster_df, columns=["Cluster ID", "Seq length", "Seq header",
                                                   "Seq match start idx", "Seq match end idx",
                                                   "Ref match start idx", "Ref match end idx", "Similarity"])

    return cluster_df