
synthMeth={

        "ErrASE":{
            "syn_sub_prob":0.2,
            "syn_ins_prob":0.2,
            "syn_del_prob":0.2,
            "syn_raw_rate":0.000025,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        },

        "MutS":{
            "syn_sub_prob":0.15,
            "syn_ins_prob":0.15,
            "syn_del_prob":0.7,
            "syn_raw_rate":0.0001,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        }

        "ConsensusShuffle":{
            "syn_sub_prob":0.15,
            "syn_ins_prob":0.15,
            "syn_del_prob":0.7,
            "syn_raw_rate":0.000125,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        }

        "Oligo":{
            "syn_sub_prob":0.2,
            "syn_ins_prob":0.2,
            "syn_del_prob":0.6,
            "syn_raw_rate":0.0004,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        }

        "HighTemperature":{
            "syn_sub_prob":0.02,
            "syn_ins_prob":0.2,
            "syn_del_prob":0.6,
            "syn_raw_rate":0.0017,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        }

        "ErrASE(Mic)":{
            "syn_sub_prob":0.2,
            "syn_ins_prob":0.2,
            "syn_del_prob":0.6,
            "syn_raw_rate":0.00125,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        }

        "Nuclease":{
            "syn_sub_prob":0.2,
            "syn_ins_prob":0.2,
            "syn_del_prob":0.6,
            "syn_raw_rate":0.00033,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        }

         "NGS":{
            "syn_sub_prob":0.2,
            "syn_ins_prob":0.2,
            "syn_del_prob":0.6,
            "syn_raw_rate":0.00011,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        }

         "None":{
            "syn_sub_prob":0.3,
            "syn_ins_prob":0.3,
            "syn_del_prob":0.3,
            "syn_raw_rate":0.0,
            "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
            "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "syn_del_pos":{"homopolymer":0,"random":1},
            "syn_ins_pos":{"homopolymer":0,"random":1}
        }

}


decHost={

        "Ecoli":{
            "dec_sub_prob":0.84,
            "dec_ins_prob":0.08,
            "dec_del_prob":0.08,
            "dec_raw_rate":0.0000000044,
            "dec_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_del_pos":{"homopolymer":0,"random":1},
            "dec_ins_pos":{"homopolymer":0,"random":1}
        },

        "Hsapiens":{
            "dec_sub_prob":0.88,
            "dec_ins_prob":0.06,
            "dec_del_prob":0.06,
            "dec_raw_rate":0.000000000069,
            "dec_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_del_pos":{"homopolymer":0,"random":1},
            "dec_ins_pos":{"homopolymer":0,"random":1}
        },

        "Mmusculus":{
            "dec_sub_prob":0.95,
            "dec_ins_prob":0.025,
            "dec_del_prob":0.025,
            "dec_raw_rate":0.0000000044,
            "dec_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_del_pos":{"homopolymer":0,"random":1},
            "dec_ins_pos":{"homopolymer":0,"random":1}
        },

        "Dmelanogaster":{
            "dec_sub_prob":0.34,
            "dec_ins_prob":0.33,
            "dec_del_prob":0.33,
            "dec_raw_rate":0.000000021,
            "dec_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_del_pos":{"homopolymer":0,"random":1},
            "dec_ins_pos":{"homopolymer":0,"random":1}
        },

        "Scerevisiae":{
            "dec_sub_prob":0.74,
            "dec_ins_prob":0.13,
            "dec_del_prob":0.13,
            "dec_raw_rate":0.000000079,
            "dec_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_del_pos":{"homopolymer":0,"random":1},
            "dec_ins_pos":{"homopolymer":0,"random":1}
        },

        "Erasure":{
            "dec_sub_prob":0.0,
            "dec_ins_prob":0.0,
            "dec_del_prob":1,
            "dec_raw_rate":0.005,
            "dec_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_del_pos":{"homopolymer":0,"random":1},
            "dec_ins_pos":{"homopolymer":0.5,"random":0.5}
        },

        "WhiteGaussian":{
            "dec_sub_prob":1,
            "dec_ins_prob":0,
            "dec_del_prob":0,
            "dec_raw_rate":0.005,
            "dec_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "dec_sub_pattern":{"A":{"C":0.3333,"G":0.33340000000003,"T":0.3333},
                                "C":{"A":0.3333,"G":0.333400000003,"T":0.3333},
                                "G":{"A":0.3333,"C":0.3333,"T":0.333400000004},
                                "T":{"A":0.3333,"C":0.3333,"T":0.333400000004}
                                }
            "dec_del_pos":{"homopolymer":0.5,"random":0.5},
            "dec_ins_pos":{"homopolymer":0.5,"random":0.5}
        }


}

pcrPoly={

        "Taq":{
            "pcr_sub_prob":0.99,
            "pcr_ins_prob":0,
            "pcr_del_prob":0.01,
            "pcr_raw_rate":0.000043,
            "pcr_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_sub_pattern":{
                                "A":{"C":0.02,"G":0.97,"T":0.01},
                                "C":{"A":0,"G":0,"T":1},
                                "G":{"A":1,"C":0,"T":0},
                                "T":{"A":0.01,"C":0.97,"G":0.02}
                                }
            "pcr_del_pos":{"homopolymer":0,"random":1},
            "pcr_ins_pos":{"homopolymer":0,"random":1}
        },

        "Phusion":{
            "pcr_sub_prob":0.99,
            "pcr_ins_prob":0,
            "pcr_del_prob":0.01,
            "pcr_raw_rate":0.000043,
            "pcr_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_sub_pattern":{
                                "A":{"C":0.02,"G":0.97,"T":0.01},
                                "C":{"A":0,"G":0,"T":1},
                                "G":{"A":1,"C":0,"T":0},
                                "T":{"A":0.01,"C":0.97,"G":0.02}
                                }
            "pcr_del_pos":{"homopolymer":0,"random":1},
            "pcr_ins_pos":{"homopolymer":0,"random":1}
        },

         "Pwo":{
            "pcr_sub_prob":1,
            "pcr_ins_prob":0,
            "pcr_del_prob":0,
            "pcr_raw_rate":0.0000026,
            "pcr_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_sub_pattern":{
                                "A":{"C":0,"G":1,"T":0},
                                "C":{"A":0,"G":0,"T":1},
                                "G":{"A":0.57,"C":0.43,"T":0},
                                "T":{"A":0.33,"C":0.67,"G":0}
                                }
            "pcr_del_pos":{"homopolymer":0,"random":1},
            "pcr_ins_pos":{"homopolymer":0,"random":1}
        },

         "Pfu":{
            "pcr_sub_prob":1,
            "pcr_ins_prob":0,
            "pcr_del_prob":0,
            "pcr_raw_rate":0.0000028,
            "pcr_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_sub_pattern":{
                                "A":{"C":0,"G":0.75,"T":0.25},
                                "C":{"A":0,"G":0,"T":1},
                                "G":{"A":1,"C":0,"T":0},
                                "T":{"A":0.25,"C":0.75,"G":0}
                                }
            "pcr_del_pos":{"homopolymer":0,"random":1},
            "pcr_ins_pos":{"homopolymer":0,"random":1}
        },

        "None":{
            "pcr_sub_prob":0.3334,
            "pcr_ins_prob":0.3333,
            "pcr_del_prob":0.3333,
            "pcr_raw_rate":0.0,
            "pcr_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_del_pos":{"homopolymer":0,"random":1},
            "pcr_ins_pos":{"homopolymer":0,"random":1}
        },


}
