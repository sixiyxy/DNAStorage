
synthMeth={

        "ErrASE":{
            "syn_sub_prob":0.2/3,
            "syn_ins_prob":0.2,
            "syn_del_prob":0.2,
            "syn_raw_rate":0.000025,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        },

        "MutS":{
            "syn_sub_prob":0.15/3,
            "syn_ins_prob":0.15,
            "syn_del_prob":0.7,
            "syn_raw_rate":0.0001,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        }

}


decHost={

        "Ecoli":{
            "dec_sub_prob":0.84/3,
            "dec_ins_prob":0.08,
            "dec_del_prob":0.08,
            "dec_raw_rate":0.0000000044,
            "dec_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_del_pos":{"homopolymer":0,"random":1},
            "dec_ins_pos":{"homopolymer":0,"random":1}
        },

        "Hsapiens":{
            "dec_sub_prob":0.88/3,
            "dec_ins_prob":0.06,
            "dec_del_prob":0.06,
            "dec_raw_rate":0.000000000069,
            "dec_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_del_pos":{"homopolymer":0,"random":1},
            "dec_ins_pos":{"homopolymer":0,"random":1}
        }

}
