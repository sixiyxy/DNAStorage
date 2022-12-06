#rm -rf dna-storage-designer/
#cp -r dist dna-storage-designer
#tar -zcf dna-storage-designer.tar.gz dna-storage-designer/
#scp dna-storage-designer.tar.gz lyh@121.192.180.202:/home/lyh/deployment
#ssh lyh@121.192.180.202 "rm -rf /home/lyh/deployment/dna-storage-designer; tar -zxvf /home/lyh/deployment/dna-storage-designer.tar.gz -C /home/lyh/deployment/;"
#rm -rf dna-storage-designer/
#rm -f dna-storage-designer.tar.gz


# 配置 dna 免密登录后可直接部署，部署到 /home/dna/front 下
rm -rf dna-storage-designer/
cp -r dist dna-storage-designer
tar -zcf dna-storage-designer.tar.gz dna-storage-designer/
scp -i ~/.ssh/id_rsa_202 dna-storage-designer.tar.gz dna@121.192.180.202:/home/dna/front 
# scp dna-storage-designer.tar.gz dna@121.192.180.202:/home/dna/front
ssh dna@121.192.180.202 "rm -rf /home/dna/front/dna-storage-designer; tar -zxf /home/dna/front/dna-storage-designer.tar.gz -C /home/dna/front/;"
rm -rf dna-storage-designer/
rm -f dna-storage-designer.tar.gz