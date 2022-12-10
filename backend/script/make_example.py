import sys,os
import shutil
import subprocess

example_id = sys.argv[1]
backend_dir = sys.argv[2]

print('Now use the {} as example'.format(example_id))

# yaml
upload_dir ='{}/upload'.format(backend_dir)
example_yaml = '{}/example.yaml'.format(upload_dir)
os.remove(example_yaml)

new_example_yaml = '{}/{}.yaml'.format(upload_dir,example_id)
shutil.copy(new_example_yaml,example_yaml)

# encode
encode_dir = '{}/encode'.format(backend_dir)
# example_txt = '{}/example.txt'.format(encode_dir)
example_fasta = '{}/example.fasta'.format(encode_dir)
example_demo = '{}/example_demo.dna'.format(encode_dir)
example_tar = '{}/example.tar.gz'.format(encode_dir)
# os.remove(example_txt)
os.remove(example_fasta)
os.remove(example_demo)
os.remove(example_tar)


# new_example_txt = '{}/{}.txt'.format(encode_dir,example_id)
new_example_fasta = '{}/{}.fasta'.format(encode_dir,example_id)
new_example_demo = '{}/{}_demo.dna'.format(encode_dir,example_id)
new_example_tar = '{}/{}.tar.gz'.format(encode_dir,example_id)
# shutil.copy(new_example_txt,example_txt)
shutil.copy(new_example_fasta,example_fasta)
shutil.copy(new_example_demo,example_demo)

example_dir = '{}/example'.format(encode_dir)
os.mkdir(example_dir)
# shutil.copy(new_example_txt,example_txt)
shutil.copy(new_example_fasta,example_fasta)
shutil.copy(new_example_yaml,example_yaml)
downfile_name = '{}/example.tar.gz'.format(encode_dir)
subprocess.call(["tar", "zcvf", downfile_name, "-P", example_dir])
shutil.rmtree(example_dir)

# simulation
simulation_dir = '{}/simulation'.format(backend_dir)
example_simulation = '{}/example.fasta'.format(simulation_dir)
os.remove(example_simulation)

new_simulation = '{}/{}.fasta'.format(simulation_dir,example_id)
shutil.copy(new_simulation,example_simulation)

# decode
decode_dir = '{}/decode'.format(backend_dir)
example_decode = '{}/example.npz'.format(decode_dir)
os.remove(example_decode)

new_decode = '{}/{}.npz'.format(decode_dir,example_id)
shutil.copy(new_decode,example_decode)