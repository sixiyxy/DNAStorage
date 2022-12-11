import sys,os
import shutil
import subprocess

example_id = sys.argv[1]
remote_backend_dir = "/home/dna/DNAStorage/backend/"
local_backend_dir = '/Users/jianglikun/VScode/DNAStorage/backend/'
print('Now use the {} as example'.format(example_id))

######## yaml
local_example_yaml = '{}/upload/example.yaml'.format(local_backend_dir)
new_example_yaml = '{}/upload/{}.yaml'.format(remote_backend_dir,example_id)
# copy remote yaml to local
cmd = 'scp dna@121.192.180.202:{} {}'.format(new_example_yaml,local_example_yaml)
print(cmd)
os.system(cmd)

######## encode
local_example_fasta = '{}/encode/example.fasta'.format(local_backend_dir)
local_example_demo = '{}/encode/example_demo.dna'.format(local_backend_dir)
# copy remote encode file to local
remote_example_fasta = '{}/{}.fasta'.format(remote_backend_dir,example_id)
remote_example_demo = '{}/{}_demo.dna'.format(remote_backend_dir,example_id)
cmd = 'scp dna@121.192.180.202:{} {}'.format(remote_example_fasta,local_example_fasta)
print(cmd)
os.system(cmd)
cmd = 'scp dna@121.192.180.202:{} {}'.format(remote_example_demo,local_example_demo)
print(cmd)
os.system(cmd)
# local tar file
local_example_dir = '{}/enocde/example'.format(local_backend_dir)
local_example_tar = '{}/encdeo/example.tar.gz'.format(local_backend_dir)
os.mkdir(local_example_dir)
shutil.copy(local_example_fasta,local_backend_dir+'/example.fasta')
shutil.copy(local_example_yaml,local_example_dir+'/example.yaml')
subprocess.call(["tar", "zcvf", local_example_dir, "-P", local_example_tar])
shutil.rmtree(local_example_dir)

########### simulation
local_example_simulation = '{}/simulation/example.fasta'.format(local_backend_dir)
remote_simulation = '{}/{}.fasta'.format(remote_backend_dir,example_id)
# copy to local
cmd = 'scp dna@121.192.180.202:{} {}'.format(remote_simulation,local_example_simulation)
print(cmd)
os.system(cmd)


########## decode
local_example_decode = '{}/decode/example.npz'.format(local_backend_dir)
remote_decode = '{}/{}.npz'.format(remote_backend_dir,example_id)
cmd = 'scp dna@121.192.180.202:{} {}'.format(remote_decode,local_example_decode)
print(cmd)
os.system(cmd)
