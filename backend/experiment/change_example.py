# python3
# -*- coding:utf-8 -*-
# 

"""
@author:野山羊骑士
@e-mail：thankyoulaojiang@163.com
@file:PycharmProjects-PyCharm-change_example.py.py
@time:2023/6/8 上午11:43
"""

import sys,os
import shutil
import subprocess

example_id = 1666625580789010432
backend_dir = "/home/dna/DNAStorage/backend/"
encode_dir = '{}/encode/'.format(backend_dir)
info_dir = '{}/upload/'.format(backend_dir)
simu_dir = '{}/simulation/'.format(backend_dir)
decode_dir = '{}/decode/'.format(backend_dir)

###### yaml
ori_yaml = '{}/example.yaml'.format(info_dir)
bk_ori_yaml = '{}/bk_example.yaml'.format(info_dir)
new_yaml = '{}/{}.yaml'.format(info_dir,example_id)
# back up
shutil.copy(ori_yaml,bk_ori_yaml)
# change
shutil.copy(new_yaml,ori_yaml)

###### encode
ori_fasta = '{}/example.fasta'.format(encode_dir)
ori_demo_fasta = '{}/example_demo.fasta'.format(encode_dir)
ori_tar = '{}/example.tar.gz'.format(encode_dir)
bk_ori_fasta  = '{}/bk_example.fasta'.format(encode_dir)
bk_ori_demo_fasta = '{}/bk_example_demo.fasta'.format(encode_dir)
bk_ori_tar = '{}/bk_example.tar.gz'.format(encode_dir)
new_fasta = '{}/{}.fasta'.format(encode_dir,example_id)
new_demo_fasta = '{}/{}_demo.fasta'.format(encode_dir,example_id)

# back up
shutil.copy(ori_fasta,bk_ori_fasta)
shutil.copy(ori_demo_fasta,bk_ori_demo_fasta)
shutil.copy(ori_tar,bk_ori_tar)
# change
shutil.copy(new_fasta,ori_fasta)
shutil.copy(new_demo_fasta,ori_demo_fasta)
example_dir = '{}/example/'.format(encode_dir)
shutil.copy(ori_fasta,example_dir+'example.fasta')
shutil.copy(ori_yaml,example_dir+'example.yaml')
subprocess.call(["tar","zcvf",ori_tar,"-P",example_dir])
shutil.rmtree(example_dir)

####### simulation
ori_simu_fasta = '{}/example.fasta'.format(simu_dir)
bk_simu_fasta = '{}/bk_example.fasta'.format(simu_dir)
new_simu_fasta = '{}/{}.fasta'.format(simu_dir,example_id)

# back up
shutil.copy(ori_simu_fasta,bk_simu_fasta)
# change
shutil.copy(new_simu_fasta,ori_simu_fasta)

######## decode
ori_decode_npz = '{}/example.npz'.format(decode_dir)
bk_ori_decode_npz = '{}/bk_example.npz'.format(decode_dir)
new_decode_npz = '{}/{}.npz'.format(decode_dir,example_id)

# back up
shutil.copy(ori_decode_npz,bk_ori_decode_npz)
# change
shutil.copy(new_decode_npz,ori_decode_npz)
