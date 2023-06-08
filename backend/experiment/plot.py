# python3
# -*- coding:utf-8 -*-
# 

"""
@author:野山羊骑士
@e-mail：thankyoulaojiang@163.com
@file:PycharmProjects-PyCharm-plot.py
@time:2023/6/5 下午12:11
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import seaborn.objects as so
sns.set_style('darkgrid')


def plot_bar(homo_df,name):
    col_pal = sns.color_palette("colorblind")
    length1_df = homo_df[homo_df['length'] == str(1)]
    p1 = plt.bar(np.arange(7), length1_df['number'], color=col_pal[0])

    length2_df = homo_df[homo_df['length'] == str(2)]
    bottom1 = length1_df['number']
    p2 = plt.bar(np.arange(7), length2_df['number'], bottom=bottom1, color=col_pal[1])

    length3_df = homo_df[homo_df['length'] == str(3)]
    bottom2 = np.sum([bottom1, length2_df['number']], axis=0).tolist()
    p3 = plt.bar(np.arange(7), length3_df['number'], bottom=bottom2, color=col_pal[2])

    length4_df = homo_df[homo_df['length'] == str(4)]
    bottom3 = np.sum([bottom2, length3_df['number']], axis=0).tolist()
    p4 = plt.bar(np.arange(7), length4_df['number'], bottom=bottom3, color=col_pal[3])

    length5_df = homo_df[homo_df['length'] == str(5)]
    bottom4 = np.sum([bottom3, length4_df['number']], axis=0).tolist()
    p5 = plt.bar(np.arange(7), length5_df['number'], bottom=bottom4, color=col_pal[4])

    length6_df = homo_df[homo_df['length'] == str(6)]
    bottom5 = np.sum([bottom4, length5_df['number']], axis=0).tolist()
    p6 = plt.bar(np.arange(7), length6_df['number'], bottom=bottom5, color=col_pal[5])

    length7_df = homo_df[homo_df['length'] == str(7)]
    bottom6 = np.sum([bottom5, length6_df['number']], axis=0).tolist()
    print(bottom6)
    p7 = plt.bar(np.arange(7), length7_df['number'], bottom=bottom6, color=col_pal[6])


    # plt.xlabel('method')
    plt.title(name,loc='left')
    plt.xticks(np.arange(7), list(length1_df['method']))
    plt.xticks(rotation=40, fontsize=7)
    plt.yticks(fontsize=7)
    # plt.yticks(np.arange(0, 81, 10))
    plt.legend((p1[0], p2[0], p3[0], p4[0], p5[0], p6[0], p7[0]),
               (1, 2, 3, 4, 5, 6, 7),
               fontsize=6,loc='upper right')

my_dpi=100
plt.figure(figsize=(8,8),dpi=my_dpi)
##### gc content
df = pd.read_csv('gc_df.csv')
file_dict = {'pic':"impression sunrise.jpg",'mp3':"so far away.mp3",'exe':"winmine.exe"}
df['file'] = df['name'].map(file_dict)
ax1 = plt.subplot(2,2,1)
p = sns.boxplot(data=df,x='method',y='number',hue='file',ax=ax1,width=0.9,linewidth=.3,fliersize=1)
plt.legend(fontsize=6,loc='lower right')

plt.title('A', loc='left')
plt.ylabel('GC content(%)',fontsize=9)
plt.xlabel('')
plt.xticks(rotation=15,fontsize=7)
plt.yticks(fontsize=7)



#### free energy
energy_df = pd.read_csv('energy_df.csv')
ax2 = plt.subplot(2,2,2)
file_dict = {'pic':"impression sunrise.jpg",'mp3':"so far away.mp3",'exe':"winmine.exe"}
energy_df['file'] = energy_df['name'].map(file_dict)
sns.boxplot(data=energy_df,x='method',y='energy',hue='file',ax=ax2,width=0.9,linewidth=.3,fliersize=1)
plt.ylabel('Minimum free energy (Kcal/mol)',fontsize=9)
plt.xlabel('')
plt.title('B', loc='left')
plt.xticks(rotation=15,fontsize=7)
plt.yticks(fontsize=7)
ax2.legend(fontsize=6,loc='lower right')


#### homo length
homo_data = pd.read_csv('homo_df.csv')
homo_data = homo_data[homo_data['length']<8]
# homo_data = homo_data[homo_data['name']=='pic']
homo_data['length'] = homo_data['length'].astype(str)


# plot
plt.subplot(2,3,4)
plot_bar(homo_data[homo_data['name']=='pic'],'C')
plt.ylabel('sequence number',fontsize=9)
plt.subplot(2,3,5)
plot_bar(homo_data[homo_data['name']=='mp3'],'D')

plt.subplot(2,3,6)
plot_bar(homo_data[homo_data['name']=='exe'],'E')


plt.show()