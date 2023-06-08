import pandas as pd
import numpy as np
import yaml



pic_dict = {"vanilla":1665344589734744064,
                "Ping's":1665344767996858368,
                "Erlich's":1665345046855159808,
                "George's":1665345419472932864,
                "Goldman's":1665345525404274688,
                "Grass's":1665345608644431872,
                "Blawat's":1665345694107570176,
                }

mp3_dict = {"vanilla":1665518680177512448,
                "Ping's":1665521142477230080,
                "Erlich's":1665521484392697856,
                "George's":1665521764895166464,
                "Goldman's":1665521911259598848,
                "Grass's":1665522711612493824,
                "Blawat's":1665522992022687744,
                }
exe_dict = {"vanilla":1665525919806263296,
                "Ping's":1665526020389867520,
                "Erlich's":1665527777429950464,
                "George's":1665527953305505792,
                "Goldman's":1665528055738798080,
                "Grass's":1665528165356933120,
                "Blawat's":1665528256906006528,
                }

# free energy
energy_df = pd.DataFrame()
min_free_energy_list = []
method_li = []
fname_li = []
r = 7000
n = 0
for file_dic in [pic_dict,mp3_dict,exe_dict]:

    for method,id in file_dic.items():
        dir = '/data2/dna/DNAStorage/backend/'
        free_enerfy_file = '{}/encode/{}_min_free_energy.txt'.format(dir,id)
        
        min_free_energy_30 = []
        with open(free_enerfy_file) as f:
            for line in f.readlines():
                if '(' in line:
                    value = line.split('(')[-1]
                    value = float(value.replace(')',''))
                    min_free_energy_list.append(value)
                    method_li.append(method)
                    if value < -30:
                        min_free_energy_30.append(value)
        avg_free_energy = round(np.mean(min_free_energy_list),2)
        free_energy_30 = round(len(min_free_energy_30)/len(min_free_energy_list)*100,2)
        bins = np.linspace(min(min_free_energy_list),max(min_free_energy_list),31)

        print(id,avg_free_energy)
    if n == 0:
        fname_li += ['pic']*r
    elif n == 1:
        fname_li += ['mp3']*r
    elif n == 2:
        fname_li += ['exe']*r
    n+=1
energy_df['energy'] = min_free_energy_list
energy_df['method'] = method_li
energy_df['name'] = fname_li
print(energy_df)
energy_df.to_csv('energy_df.csv')

# GC content
gc_df = pd.DataFrame()
num_li = []
method_li = []
fname_li = []
n = 0
r  = 7000
for file_dic in [pic_dict,mp3_dict,exe_dict]:
    
    for method,id in file_dic.items():
        dir = '/data2/dna/DNAStorage/backend/'
        info_file = '{}/upload/{}.yaml'.format(dir,id)
        # print(info_file)
        f = open(info_file)
        info_data = f.read()
        info_data = yaml.load(info_data,Loader=yaml.FullLoader)
        gc_li = info_data['gc_data']
        for i in gc_li:
            x = i['x_value']
            y = i['y_value']
            num_li += [x]*y
    
        method_li += [method]*1000        
    if n == 0:
        fname_li += ['pic']*r
    elif n == 1:
        fname_li += ['mp3']*r
    elif n == 2:
        fname_li += ['exe']*r
    print(len(num_li),len(method_li),len(fname_li))
    n += 1
gc_df['method'] = method_li
gc_df['number'] = num_li
gc_df['name'] = fname_li
print(gc_df)
gc_df.to_csv('gc_df.csv')


# gc_df = pd.DataFrame()
# method_li = []
# gc_li = []
# fname_li = []
# n = 0
# for file_dic in [pic_dict,mp3_dict,exe_dict]:
#     for method,id in file_dic.items():
#         dir = '/data2/dna/DNAStorage/backend/'
#         info_file = '{}/upload/{}.yaml'.format(dir,id)
#         # print(info_file)
#         f = open(info_file)
#         info_data = f.read()
#         info_data = yaml.load(info_data,Loader=yaml.FullLoader)
#         plot_li = info_data['gc_data']
#         get_li = []
#         for i in plot_li:
#             x = i['x_value']
#             y = i['y_value']
#             gc = x*y/100
#             get_li.append(gc)
#         gc_li.append(sum(get_li)/1000)
#         method_li.append(method)
#     if n == 0:
#         fname_li += ['pic']*7
#     elif n == 1:
#         fname_li += ['mp3']*7
#     elif n == 2:
#         fname_li += ['exe']*7
#     print(len(method_li),len(fname_li))
#     n += 1
# gc_df['method'] = method_li
# gc_df['gc'] = gc_li
# gc_df['name'] = fname_li
# print(gc_df)
# gc_df.to_csv('gc_df.csv')

# repeat sequence
homo_df = pd.DataFrame()
num_li = []
length_li = []
method_li = []
fname_li = []
n = 0
for file_dic in [pic_dict,mp3_dict,exe_dict]:
    for method,id in file_dic.items():
        dir = '/data2/dna/DNAStorage/backend/'
        info_file = '{}/upload/{}.yaml'.format(dir,id)
        # print(info_file)
        f = open(info_file)
        info_data = f.read()
        info_data = yaml.load(info_data,Loader=yaml.FullLoader)
        # print(info_data)
        gc_li = info_data['homo_data']
        for i in gc_li:
            x = i['x_value']
            y = i['y_value']
            length_li.append(x)
            num_li.append(y)
            method_li.append(method)
    if n == 0:
        fname_li += ['pic']*19*7
    elif n == 1:
        fname_li += ['mp3']*19*7
    elif n == 2:
        fname_li += ['exe']*19*7
    print(len(num_li),len(method_li),len(fname_li))
    n+=1
homo_df['method'] = method_li
homo_df['length'] = length_li 
homo_df['number'] = num_li
homo_df['name'] = fname_li
print(homo_df)
homo_df.to_csv('homo_df.csv')

