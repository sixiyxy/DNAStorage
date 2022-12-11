
import pickle
import re
from .encoding_method_rule import *

#纠错表，字母纠错表
columA={"TAACCG":(True,'a'),"TAAGGC":(True,'b')}
columB={"ATCACG":(True,'c'),"ATGAGC":(True,'d')}
columC={"ATGGAG":(True,'e'),"TACCAC":(True,'f')}
columD={"ATCCGT":(True,'g'),"ATGCCA":(True,'h'),"TAGCGA":(True,'i'),"TAGGCT":(True,'j')}
columE={"ACATCG":(True,'k'),"ACTTGC":(True,'l'),"TCTACG":(True,'m')}
columF={"ACACAC":(True,'n'),"ACTCTG":(True,'o'),"TCAGAG":(True,'p')}
columG={"ACAGGT":(True,'q'),"ACTGCA":(True,'r'),"AGACCT":(True,'s'),"TCTCGT":(True,'t')}
columH={"TCGAAC":(True,'u')}
columI={"ACGACT":(True,'v')}
columJ={"CATTCG":(True,'w')}
columK={"CTACAG":(True,'x')}
columL={"CAACGT":(True,'y')}
columM={"CAGACA":(True,'z')}


eMapDic={"000111":columA,"001011":columB,"001101":columC,"001110":columD,"010011":columE,"010101":columF,
         "010110":columG,"011001":columH,"011010":columI,"100011":columJ,"100101":columK,"100110":columL,
         "101010":columM}

#纠错表，数字纠错表
dcolumA={"TAACCG":(True,'0'),"TAAGGC":(True,'1')}
dcolumB={"ATCACG":(True,'2'),"ATGAGC":(True,'3')}
dcolumC={"ATGGAG":(True,'4'),"TACCAC":(True,'5')}
dcolumD={"ATCCGT":(True,'6'),"ATGCCA":(True,'7'),"TAGCGA":(True,'8'),"TAGGCT":(True,'9')}
dcolumE={}
dcolumF={}
dcolumG={}
dcolumH={}
dcolumI={}
dcolumJ={}
dcolumK={}
dcolumL={}
dcolumM={}
dMapDic={"000111":dcolumA,"001011":dcolumB,"001101":dcolumC,"001110":dcolumD,"010011":dcolumE,"010101":dcolumF,
         "010110":dcolumG,"011001":dcolumH,"011010":dcolumI,"100011":dcolumJ,"100101":dcolumK,"100110":dcolumL,
         "101010":dcolumM}

###########################符号表###################################################################################

scolumA={"TAACCG":(True,'@'),"TAAGGC":(True,'￥')}
scolumB={"ATCACG":(True,'$'),"ATGAGC":(True,',')}
scolumC={"ATGGAG":(True,'*'),"TACCAC":(True,'/')}
scolumD={"ATCCGT":(True,'('),"ATGCCA":(True,':'),"TAGCGA":(True,'\''),"TAGGCT":(True,'[')}
scolumE={"ACATCG":(True,';'),"ACTTGC":(True,'.'),"TCTACG":(True,'\n')}
scolumF={"ACTCTG":(True,'\"'),"TCAGAG":(True,'%')}
scolumG={"ACAGGT":(True,'{'),"ACTGCA":(True,'~'),"AGACCT":(True,'+'),"TCTCGT":(True,'-')}
scolumH={"TCGAAC":(True,'?')}
scolumI={"ACGACT":(True,'!')}
scolumJ={"CATTCG":(True,'&')}
scolumK={"CTACAG":(True,'=')}
scolumL={"CAACGT":(True,'_')}
scolumM={"CAGACA":(True,'#')}

sMapDic={"000111":scolumA,"001011":scolumB,"001101":scolumC,"001110":scolumD,"010011":scolumE,"010101":scolumF,
         "010110":scolumG,"011001":scolumH,"011010":scolumI,"100011":scolumJ,"100101":scolumK,"100110":scolumL,
         "101010":scolumM}


#判断碱基序列是否是特殊字符（指数字表标识符，空格，大写键标识符，符号表标识符），函数返回值依次为1，2，3，4。其他碱基序列为0
def deterBaseSeqClass(tmpstr):
    if countdifferNumber(tmpstr,"CTTGTC") <2:
        return 1  #数字表标识符
    if countdifferNumber(tmpstr,"CGGTAT") <2:
        return 2  #空格表标识符
    if countdifferNumber(tmpstr,"TGCATA") <2:
        return 3  #大写标识符
    if countdifferNumber(tmpstr,"GTATGA") <2:
        return 4  #符号表标识符
    return 0

def countdifferNumber(tmpstr,target):
    k=len(tmpstr)
    l=len(target)
    counter=0
    maxlen=k
    minlen=k
    if k<l:
        maxlen=l
    else:
        minlen=l
    for i in range(minlen):
        if tmpstr[i]!=target[i]:
            counter+=1
    counter+=(maxlen-minlen)
    return counter

#根据碱基序列返回对应的数字编号
def returnNumFromBaseSeq(line,basedict):
      for vt in basedict:
        mcount=countdifferNumber(line,vt)
        if mcount<2:
            return basedict[vt]
      return 0

def  ConvertDNA_to_Inter(lstr):
    unit=       {"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    decade=     {"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    hundred=    {"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    thousand=   {"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    tenthousand={"AGACCT":0,"TCGAAC":1,"ATCACG":2,"TAGCGA":3,"TAACCG":4,"ACTCTG":5,"ACACAC":6,"CAGACA":7,"ATGAGC":8,"ACTGCA":9}
    try:
        p1=returnNumFromBaseSeq(lstr[24:30],unit)
        #块内汉明距离至少为3
        p2=returnNumFromBaseSeq(lstr[18:24],decade)
        p3=returnNumFromBaseSeq(lstr[12:18],hundred)
        p4=returnNumFromBaseSeq(lstr[6:12],thousand)
        p5=returnNumFromBaseSeq(lstr[0:6],tenthousand)
        liestr=""
        liestr+=str(p5)
        liestr+=str(p4)
        liestr+=str(p3)
        liestr+=str(p2)
        liestr+=str(p1)
        return liestr
    except:
        print("ConvertDNA_to_Inter Error")
#返回字母表里按照优先级最高的字符
def priorityValue_eMap(canlist,fileindexcount,spcflag):
    canChrlist=[] #
    if len(canlist)>2:
        for i in range(1,len(canlist)):
            if canlist[i][0] in eMapDic:
                for keystr in eMapDic[canlist[i][0]].keys():
                    matchflag=re.search(canlist[i][1],keystr,re.M)
                    if matchflag!=None:
                        canChrlist.append(eMapDic[canlist[i][0]][keystr][1])
    else:#正常出错（AT互换或者CG互换检查)
        if canlist[1][0] in eMapDic:
            for keystr in eMapDic[canlist[1][0]].keys():
                if countdifferNumber(canlist[1][1],keystr)<2:#碱基差别在1
                    canChrlist.append(eMapDic[canlist[1][0]][keystr][1])
                    continue
        else:
            canlist[0]=1
            canChrlist.append('f')

    with open("temporyfile.tf","ab") as TF:
        pickle.dump(fileindexcount,TF)
        # pickle.dump(canChrlist,TF)
        if spcflag == 1:
            pickle.dump(1,TF) #表示该字符要大写，纠正的时候要注意将其转为大写字母
        else:
            pickle.dump(0,TF)
    if len(canChrlist)!=0:
        return canChrlist[0]
    else:
        return 'f'   #字母纠正失败统一返回’f'

#返回数字表里按照优先级最高的字符
def priorityValue_dMap(canlist,fileindexcount,spcflag):
       canChrlist = []  #

       if len(canlist) > 2:
           for i in range(1, len(canlist)):
               if canlist[i][0] in dMapDic:
                   for keystr in dMapDic[canlist[i][0]].keys():
                       matchflag = re.search(canlist[i][1], keystr, re.M)
                       if matchflag != None:
                           canChrlist.append(dMapDic[canlist[i][0]][keystr][1])
       else:  # 正常出错（AT互换或者CG互换检查)
           if canlist[1][0] in dMapDic:
               for keystr in dMapDic[canlist[1][0]].keys():
                   if countdifferNumber(canlist[1][1], keystr) < 2:  # 碱基差别在1
                       canChrlist.append(dMapDic[canlist[1][0]][keystr][1])
                       continue
           else:
               canlist[0] = 1
               canChrlist.append('0')
       if len(canChrlist) != 0:
            return canChrlist[0]
       else:
            return '0' #数字纠正失败都返回'0'

#符号表简单纠错
def priorityValue_sMap(canlist,fileindexcount,spcflag):
    canChrlist = []  #

    if len(canlist)>2:
        for i in range(1,len(canlist)):
            if canlist[i][0] in sMapDic:
                for keystr in sMapDic[canlist[i][0]].keys():
                    matchflag=re.search(canlist[i][1],keystr,re.M)
                    if matchflag!=None:
                        canChrlist.append(sMapDic[canlist[i][0]][keystr][1])
    else:#正常出错（AT互换或者CG互换检查)
        if canlist[1][0] in sMapDic:
            for keystr in sMapDic[canlist[1][0]].keys():
                if countdifferNumber(canlist[1][1],keystr)<2:#碱基差别在1
                    canChrlist.append(sMapDic[canlist[1][0]][keystr][1])
                    continue
        else:
            canlist[0] = 1
            canChrlist.append('.')

    if len(canChrlist) != 0:
        return canChrlist[0]
    else:
        return '.'  # 符号纠正失败都返回'.'

#从候选列表里选择正确的纠正码，根据优先级,并返回对应的字符
def priorityValue(spcflag,candilist,fileindexcount):
    if spcflag==2:#查找数学表
       return priorityValue_dMap(candilist,fileindexcount,spcflag)
    elif spcflag==3:# 查找符号表
       return priorityValue_sMap(candilist,fileindexcount,spcflag)
    else:#查找字母表
        return priorityValue_eMap(candilist,fileindexcount,spcflag)

class RepOpitonExcepion(Exception):
    def __init__(self):
        pass
    def returnInfor(self):
        return "repOptionExcepion"

def reOptionv2(line,spcflag,rectiOneBaseError):
    listre = []
    tmpstr = ""
    count1 = 0
    flag = 0
    try:

        # 碱基单元长度不为4，即存在缺失或插入的处理
        if len(line) > 6:  # 对于插入碱基单元的序列，默认从序列前四位截断
            line = line[:6]
            flag = 4
        elif len(line) < 6:  # 对于缺失碱基单元的序列，默认从序列的最后一位进行延长
            line = line + (line[-1] * (6 - len(line)))
            flag = 2
    except:
        raise RepOpitonExcepion
    for i in range(6):
        if line[i] == 'A' or line[i] == 'T':
            tmpstr += "0"
        else:
            tmpstr += "1"
            count1 += 1
    kmin=0
    columstr=""
    rowstr=""
    flag=True

    if spcflag==0 or spcflag==1:#字母表
        for colstr in eMapDic:
            for targe in eMapDic[colstr]:
                kl=countdifferNumber(line,targe)
                if flag==True:
                    flag=False
                    kmin=kl
                    columstr=colstr
                    rowstr=targe
                elif kmin>kl:
                    kmin=kl
                    columstr = colstr
                    rowstr = targe
    elif spcflag==2:#数学表
        for colstr in dMapDic:
            for targe in dMapDic[colstr]:
                kl = countdifferNumber(line, targe)
                if flag==True:
                    flag=False
                    kmin = kl
                    columstr = colstr
                    rowstr = targe
                elif kmin > kl:
                    kmin = kl
                    columstr = colstr
                    rowstr = targe
    else:#符号表
        for colstr in sMapDic:
            for targe in sMapDic[colstr]:
                kl = countdifferNumber(line, targe)
                if flag==True:
                    flag=False
                    kmin = kl
                    columstr = colstr
                    rowstr = targe
                elif kmin > kl:
                    kmin = kl
                    columstr = colstr
                    rowstr = targe
    if kmin<2:
        if kmin==1:
            rectiOneBaseError[0]+=1
        listre.append(flag)
        listre.append((columstr,rowstr))
    else:
        listre.append(flag+1)
        listre.append((columstr, rowstr))
    return listre


def getDecodedChar(spcflag,lstr,fileindexcount,rectiOneBaseError):#specflag为1表示cabLock，specflag为2表示Transfer,specflag为0普通

    # with open("temporyfile.tf","ab") as f:#该文件的数据每行第一列为数值表示纠错字符的下标（正文），第二列为解码字符序列，第三列为候选编码列表canlist
        chr="f"
        try:
            canlist=reOptionv2(lstr,spcflag,rectiOneBaseError)
        except RepOpitonExcepion:
            print("reOptionException")
            raise
        if spcflag==0 or spcflag==1:#查找英文字母表
        #查找英文字符表
            if canlist[0]==0 or canlist[0]==2 or canlist[0]==4:#正常译码
                chr = eMapDic[canlist[1][0]][canlist[1][1]][1]
                if spcflag==1:
                    chr=str.upper(chr)
                return chr
            elif canlist[0]==1 or canlist[0]==3 or canlist[0]==5:#纠错译码
                chr= priorityValue(spcflag,canlist,fileindexcount[0])
                if spcflag==1:
                    chr=str.upper(chr)
                return chr
            else:# 无法纠正(四个0或四个1），统一输出字符为‘f'
                chr = priorityValue(spcflag, canlist,fileindexcount[0])
                if spcflag==1:
                    chr=str.upper(chr)
                return 'f'
        elif spcflag==2:#查找数学字符表
            if canlist[0]==0 or canlist[0]==2 or canlist[0]==4:#正常译码
                chr = dMapDic[canlist[1][0]][canlist[1][1]][1]
                return chr
            elif canlist[0]==1 or canlist[0]==3 or canlist[0]==5:#纠错译码
                chr= priorityValue(spcflag,canlist,fileindexcount[0])
                return chr
            else:# 无法纠正(四个0或四个1），统一输出字符为‘f'
                return '0'
        else:#查找符号表
            if canlist[0] == 0 or canlist[0] == 2 or canlist[0] == 4:  # 正常译码
                chr = sMapDic[canlist[1][0]][canlist[1][1]][1]
                return chr
            elif canlist[0] == 1 or canlist[0] == 3 or canlist[0] == 5:  # 纠错译码
                chr = priorityValue(spcflag, canlist,fileindexcount[0])
                return chr
            else:
                return '0'
        return chr;


class SrcCode():
    def __init__(self):
        self.encodetable = SrcCode_rule()
        self.dna_sequence_length = 180

    def code_num(self,num):
        unit={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        decade={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        hundred={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        thousand={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        tenthousand={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        houndredthousand={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}
        thousandthousand={0:"AGACCT",1:"TCGAAC",2:"ATCACG",3:"TAGCGA",4:"TAACCG",5:"ACTCTG",6:"ACACAC",7:"CAGACA",8:"ATGAGC",9:"ACTGCA"}


        if num>9999999:
            return None
        tmpstr=""
        p1=num%10
        p2=num//10%10
        p3=num//100%10
        p4=num//1000%10
        p5=num//10000%10
        p6=num//100000%10
        p7=num//1000000%10
        tmpstr=thousandthousand[p7]+houndredthousand[p6]+tenthousand[p5]+thousand[p4]+hundred[p3]+decade[p2]+unit[p1]
        return tmpstr

    def encodeing(self,file):
        contentlines = file.read()
        original_charater_list = []
        index_ori_charater_list = []
        dna_sequences_list = []

        linenumber = 0
        dna_sequence = ''+self.code_num(linenumber) # first line
        charater_sequence = ''
        for ch in contentlines:
            if ch==' ':#空格
                dna_sequence+="CGGTAT"
                charater_sequence += ch
            elif ch.lower() not in self.encodetable:
                pass
                # original_charater_list.append(ch)
                # dna_sequences_list.append('fail')
                # index_ori_charater_list.append('fail')
                # # print(original_charater_list)
                # # print(dna_sequences_list)
            else:
                if str.isalpha(ch):#字母字符 
                    if str.isupper(ch):#大写字母
                        dna_sequence+="TGCATA"
                    dna_sequence+=self.encodetable[ch.lower()][1]
                    
                elif self.encodetable[ch][0]==2:#数字表
                    dna_sequence+="TGCATA"
                    dna_sequence+=self.encodetable[ch][1]
                else:#符号表
                    dna_sequence+="GTATGA"
                    if ch==")":
                        ch="("
                    if ch=="}":
                        ch="{"
                    if ch=="]":
                        ch="["
                    dna_sequence += self.encodetable[ch][1]
                charater_sequence += ch
                # print(charater_sequence)
                
            if len(dna_sequence)>=self.dna_sequence_length:
                    dna_sequences_list.append(dna_sequence)
                    original_charater_list.append(charater_sequence)
                    index_ori_charater = str(charater_sequence) + str(linenumber)
                    # print(linenumber,str(charater_sequence),index_ori_charater,len(dna_sequence))
                    index_ori_charater_list.append(index_ori_charater)
                    linenumber += 1
                    dna_sequence="" + self.code_num(linenumber)
                    charater_sequence=""
        if len(dna_sequence)<180:
            # print(linenumber)
            dna_sequence+=((180-len(dna_sequence))//6)*"CGGTAT"
            index_ori_charater = str(charater_sequence) + str(linenumber)
            index_ori_charater_list.append(index_ori_charater)
            dna_sequences_list.append(dna_sequence)
            original_charater_list.append(charater_sequence)
        
        # print(len(original_charater_list),len(dna_sequences_list),len(index_ori_charater_list))
        record_data = {'dna_sequences':dna_sequences_list,
                       "original_charater_list":original_charater_list,
                       "index_ori_charater_list": index_ori_charater_list}    
        # print(record_data)
        return record_data
    
    def decode(self,dna_sequences):
        char_list = []
        char_index_list = []
        chr=""
        specflag=0
        tmpstr=""
        fileindexcount=[]
        fileindexcount.append(0)
        templines=[]
        presline=""
        rectifyNum=[0]

        for dna_seq in dna_sequences:
            lineTotal = dna_seq

        # lineTotal ='AGACCTAGACCTAGACCTAGACCTAGACCTTGCATATCTCGTATGCCAATGGAGCGGTATTGCATAACTCTGACTTGCATGAGCCGGTATTGCATATCTACGTAACCGACACACCGGTATTGCATATAACCGACACACATGAGCCGGTATTCTCGTATGCCAATGGAGCGGTATTGCATAAGACCT'
        # lineTotal ='AGACCTAGACCTAGACCTAGACCTTCGAACATGGAGTAACCGCGGTATGTATGATCTACGTGCATATCTCGTTGCATAACTCTGCGGTATTGCATAATCACGTGCATAATGCCATGCATATAACCGTGCATAACTGCATGCATAACTTGCTGCATATAGCGATGCATAATGGAGCGGTAT'
            print(lineTotal)

            linenumber=ConvertDNA_to_Inter(lineTotal[0:30])
            print(linenumber)

            presline=linenumber

            line=lineTotal[30:]
            i=0
            t=len(line)-7 #行末\n吃掉
    
            xx = ''
            for i in range(0,len(line)-1,6):
                if i>t:
                    tmpstr=line[i:-1] #舍弃掉最后一位换行符
                else:
                    tmpstr=line[i:i+6]

                # #填充字符停止执行
                # if 'N' in tmpstr:
                #     tmpstr=tmpstr.replace('N','')
                #     if len(tmpstr)==0 :
                #         break
                ktype=deterBaseSeqClass(tmpstr)
                # print(i,tmpstr,ktype)
                if ktype == 1:
                    specflag = 2  # 意味着下面的字符要查找数字表
                    continue
                if ktype==4:
                    specflag=3 #意味着下面的字符要查找符号表
                    continue
                if ktype==3:#大写键
                    specflag=1
                    continue
                if ktype==2:#空格
                    chr=' '
                    xx+=chr
                    presline+=' '
                    
                    fileindexcount[0] += 1
                    continue
                
                try:
                    chr=getDecodedChar(specflag,tmpstr,fileindexcount,rectifyNum)
                except RepOpitonExcepion:
                    print("RepOptionExcepion")
                    print(">>i: "+str(i))
                    print("tmpstr: "+tmpstr)
                    print("line: "+line)
                except:
                    print("i: " + str(i))
                    print("tmpstr: " + tmpstr)
                    print("line: " + line)

                if specflag==1 or specflag==2 or specflag==3:
                    specflag=0

                xx+=chr
                presline+=chr
                fileindexcount[0] += 1
                        
            print(xx)
            char_list.append(xx+str(linenumber))
            templines.append(presline)
            
        return char_list

if __name__ == '__main__':
        repeatid = 1
        encodefile = 'b.txt'
        temfilesize = decodeProcess_template(encodefile, 'template_refer.txt')
