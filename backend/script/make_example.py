import sys,os
import shutil
import subprocess

example_id = 1666625580789010432
remote_backend_dir = "/home/dna/DNAStorage/backend/"
local_backend_dir = '/Users/jianglikun/VScode/DNAStorage/backend/'
print('Now use the {} as example'.format(example_id))

local_encode_dir = '{}/encode/'.format(local_backend_dir)
local_info_dir = '{}/upload/'.format(local_backend_dir)
local_simu_dir = '{}/simulation/'.format(local_backend_dir)
local_decode_dir = '{}/decode/'.format(local_backend_dir)

remote_encode_dir = '{}/encode/'.format(remote_backend_dir)
remote_info_dir = '{}/upload/'.format(remote_backend_dir)
remote_simu_dir = '{}/simulation/'.format(remote_backend_dir)
remote_decode_dir = '{}/decode/'.format(remote_backend_dir)

###### yaml
ori_yaml = '{}/example.yaml'.format(local_info_dir)
bk_ori_yaml = '{}/bk_example.yaml'.format(local_info_dir)
new_yaml = '{}/{}.yaml'.format(remote_info_dir,example_id)
# local back up
shutil.copy(ori_yaml,bk_ori_yaml)
# change
cmd = 'scp -i ~/.ssh/id_rsa_202 dna@10.26.42.170:{} {}'.format(new_yaml,ori_yaml)
print(cmd)
os.system(cmd)

###### encode
ori_fasta = '{}/example.fasta'.format(local_encode_dir)
ori_demo_fasta = '{}/example_demo.dna'.format(local_encode_dir)
ori_tar = '{}/example.tar.gz'.format(local_encode_dir)
bk_ori_fasta  = '{}/bk_example.fasta'.format(local_encode_dir)
bk_ori_demo_fasta = '{}/bk_example_demo.dna'.format(local_encode_dir)
bk_ori_tar = '{}/bk_example.tar.gz'.format(local_encode_dir)
new_fasta = '{}/{}.fasta'.format(remote_encode_dir,example_id)
new_demo_fasta = '{}/{}_demo.dna'.format(remote_encode_dir,example_id)

# back up
shutil.copy(ori_fasta,bk_ori_fasta)
shutil.copy(ori_demo_fasta,bk_ori_demo_fasta)
shutil.copy(ori_tar,bk_ori_tar)

# change
cmd = 'scp -i ~/.ssh/id_rsa_202 dna@10.26.42.170:{} {}'.format(new_fasta,ori_fasta)
print(cmd)
os.system(cmd)
cmd = 'scp -i ~/.ssh/id_rsa_202 dna@10.26.42.170:{} {}'.format(new_demo_fasta,ori_demo_fasta)
print(cmd)
os.system(cmd)

local_example_dir = '{}/encode/example'.format(local_backend_dir)
local_example_tar = '{}/encode/example.tar.gz'.format(local_backend_dir)
os.mkdir(local_example_dir)
shutil.copy(ori_fasta,local_example_dir+'/example.fasta')
shutil.copy(ori_yaml,local_example_dir+'/example.yaml')
now_dir = os.getcwd()
os.chdir(local_encode_dir)
local_example_dir = 'example'.format(local_backend_dir)
local_example_tar = 'example.tar.gz'.format(local_backend_dir)
# subprocess.call(["tar", "zcvf", "example", "-P", "example.tar.gz"])
os.system('tar -cf - {}|pigz -4 -p 16 > {}'.format(local_example_dir,local_example_tar))
shutil.rmtree(local_example_dir)
os.chdir(now_dir)

####### simulation
ori_simu_fasta = '{}/example.fasta'.format(local_simu_dir)
bk_simu_fasta = '{}/bk_example.fasta'.format(local_simu_dir)
new_simu_fasta = '{}/{}.fasta'.format(remote_simu_dir,example_id)

# back up
shutil.copy(ori_simu_fasta,bk_simu_fasta)
# change
cmd = 'scp -i ~/.ssh/id_rsa_202 dna@10.26.42.170:{} {}'.format(new_simu_fasta,ori_simu_fasta)
print(cmd)
os.system(cmd)

######## decode
ori_decode_npz = '{}/example.npz'.format(local_decode_dir)
bk_ori_decode_npz = '{}/bk_example.npz'.format(local_decode_dir)
new_decode_npz = '{}/{}.npz'.format(remote_decode_dir,example_id)

# back up
shutil.copy(ori_decode_npz,bk_ori_decode_npz)
# change
cmd = 'scp -i ~/.ssh/id_rsa_202 dna@10.26.42.170:{} {}'.format(new_decode_npz,ori_decode_npz)
print(cmd)
os.system(cmd)


# import sys,os
# import shutil
# import subprocess

# example_id = sys.argv[1]
# remote_backend_dir = "/home/dna/DNAStorage/backend/"
# local_backend_dir = '/Users/jianglikun/VScode/DNAStorage/backend/'
# print('Now use the {} as example'.format(example_id))

# ######## yaml
# local_example_yaml = '{}/upload/example.yaml'.format(local_backend_dir)
# new_example_yaml = '{}/upload/{}.yaml'.format(remote_backend_dir,example_id)
# # copy remote yaml to local
# cmd = 'scp -i ~/.ssh/id_rsa_202 dna@121.192.180.202:{} {}'.format(new_example_yaml,local_example_yaml)
# print(cmd)
# os.system(cmd)

# ######## encode
# local_example_fasta = '{}/encode/example.fasta'.format(local_backend_dir)
# local_example_demo = '{}/encode/example_demo.dna'.format(local_backend_dir)
# # copy remote encode file to local
# remote_example_fasta = '{}/encode/{}.fasta'.format(remote_backend_dir,example_id)
# remote_example_demo = '{}//encode/{}_demo.dna'.format(remote_backend_dir,example_id)
# cmd = 'scp -i ~/.ssh/id_rsa_202 dna@121.192.180.202:{} {}'.format(remote_example_fasta,local_example_fasta)
# print(cmd)
# os.system(cmd)
# cmd = 'scp -i ~/.ssh/id_rsa_202 dna@121.192.180.202:{} {}'.format(remote_example_demo,local_example_demo)
# print(cmd)
# os.system(cmd)
# # local tar file
# local_example_dir = '{}/encode/example'.format(local_backend_dir)
# local_example_tar = '{}/encode/example.tar.gz'.format(local_backend_dir)
# os.mkdir(local_example_dir)
# shutil.copy(local_example_fasta,local_backend_dir+'/example.fasta')
# shutil.copy(local_example_yaml,local_example_dir+'/example.yaml')
# subprocess.call(["tar", "zcvf", local_example_tar, "-P", local_example_dir])
# shutil.rmtree(local_example_dir)

# ########### simulation
# local_example_simulation = '{}/simulation/example.fasta'.format(local_backend_dir)
# remote_simulation = '{}/simulation/{}.fasta'.format(remote_backend_dir,example_id)
# # copy to local
# cmd = 'scp -i ~/.ssh/id_rsa_202 dna@121.192.180.202:{} {}'.format(remote_simulation,local_example_simulation)
# print(cmd)
# os.system(cmd)


# ########## decode
# local_example_decode = '{}/decode/example.npz'.format(local_backend_dir)
# remote_decode = '{}/decode/{}.npz'.format(remote_backend_dir,example_id)
# cmd = 'scp -i ~/.ssh/id_rsa_202 dna@121.192.180.202:{} {}'.format(remote_decode,local_example_decode)
# print(cmd)
# os.system(cmd)
