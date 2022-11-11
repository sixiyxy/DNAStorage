rm -rf dna-storage-designer/
cp -r dist dna-storage-designer
tar -zcf dna-storage-designer.tar.gz dna-storage-designer/
scp dna-storage-designer.tar.gz lyh@121.192.180.202:/home/lyh/deployment
ssh lyh@121.192.180.202 "rm -rf /home/lyh/deployment/dna-storage-designer; tar -zxvf /home/lyh/deployment/dna-storage-designer.tar.gz -C /home/lyh/deployment/;"
rm -rf dna-storage-designer/
rm -f dna-storage-designer.tar.gz