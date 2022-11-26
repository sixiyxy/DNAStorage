import React from "react";
import { useEffect, useState } from 'react';
import { Breadcrumb,Image,Table,Anchor} from 'antd';
import "./index.less";
import Home1031 from "../../assets/tutorial/Home1031.png"
import xiamen from "../../assets/tutorial/xiamen.png"
import gc from "../../assets/tutorial/gc.png"
import rp from "../../assets/tutorial/rp.png"
import free from "../../assets/tutorial/rp.png"
import type { ColumnsType } from "antd/es/table";
export class TutorialProps {}

const { Link } = Anchor;
export const Tutorial: React.FC<TutorialProps> = (props) => {
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);
  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
    window.scrollTo(0,0);
  }, []);

  const scrollToAnchor = (e, link) => {
    e.preventDefault();

    if(link.href) {
      let anchorElement = document.getElementById(link.href);
      if(anchorElement) {
        anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'})
      }
    }
  }
  interface DataType {
    key: string;
    name1: string;
    value1: any;
  }
  const columns1: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name1",
      width: "55%",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Information",
      dataIndex: "value1",
      align: "center",
    },
  ];
  const data1: DataType[] = [
    {
      key: "1",
      name1: "Encode method",
      value1: 'user choice',
    },
    {
      key: "2",
      name1: "Segment lenth",
      value1: 'user choice',
    },
    {
      key: "3",
      name1: "Index length",
      value1: 'user choice',
    },
    {
      key: "4",
      name1: "Verify method",
      value1: 'user choice',
    },
    {
      key: "5",
      name1: "Segment number",
      value1: 'the total number of segments after the file is split',
    },
    {
      key: "6",
      name1: "Encode time",
      value1: 'time spend in encoding uploaded file',
    },
    {
      key: "7",
      name1: "Single DNA length",
      value1: 'the length of each dna sequence which encodes form segment bits',
    },
    {
      key: "8",
      name1: "DNA sequence number",
      value1: 'each segment will be encoded as a DNA sequence, it is the same as the number of segments',
    },
    {
      key: "9",
      name1: "Nucleotide counts",
      value1: 'the number of bases in all DNA sequences',
    },
    {
      key: "10",
      name1: "Information density",
      value1: 'the ratio of Nucleotide counts to File bits',
    },
    {
      key: "11",
      name1: "Physical information density",
      value1: 'The ratio of File bytes to the total mass of DNA sequences (Define 1.5pmol * 1000bp = 9.03 * 10^14bp = 1ug)',
    },
  ];
  return (
    <div className="tutorial-container">
      <div className="tutorial">
        <div className="tutorial-content">
          <div className="Breadcrumb">
                <Breadcrumb separator=">">
                      <Breadcrumb.Item>
                        <a href="/home">Home</a>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>Tutorial</Breadcrumb.Item>
                  </Breadcrumb>
              </div>
          <div id="DNA-storage-designer">
            <h3 id="first-title">DNA storage designer</h3>
            <Image src={Home1031} width={"90%"} rootClassName="image1"/>
          </div>
          <div id="what-is-it">
            <h3 id="second-title">What is it</h3>
            <p id="text-content">
            With the total amount of worldwide data skyrocketing, traditional storage methods face daunting challenges. 
            The international data storage demand will far exceed the storage capacity of any currently available storage method. 
            DNA molecules as information carriers have many advantages over traditional storage media. Its high storage density, 
            potentially low maintenance cost and other excellent characteristics make it an ideal alternative for information storage, 
            and is expected to provide wide practicality in the future. DNA Storage Designer is an easy-to-use online web server that covers 
            the simulation of the whole process of DNA storage application. It includes 8 popular encoding methods and realized the corresponding decoding process. 
            In addition, it also simulated the sequence errors in the five DNA sequence storage processes of synthesis, decay, PCR, sample, and sequencing. 
            Users can not only use independent encode modules to encode files and obtain DNA sequences for vivo/in vivo storage experiments, 
            but also upload DNA sequences to simulate sequence errors during storage by the 'Error Simulation' modules. 
            Aiming to provide user-friendly services, this website embedded the most popular methods and platforms related to DNA storage instead of asking users for complex parameters. 
            It also gives thorough guidelines and simulated feedback based on user settings so that user could adjust their experimental plan based on the report.
            </p>
          </div>
          <div id="example-file">
              <h3 id="third-title">Example file</h3>
              <p id="text-content">
              We use the Xiamen University badge picture as an example file to introduce the working process of the website.
              </p>
              <Image src={xiamen} width={"50%"} rootClassName="image2"/>
              <p style={{textAlign:"center"}}>Example File</p>
              <p id="text-content">
              Other demo files can be downloaded from here. The file types include: Image, video, audio, text, and binary.

              </p>
          </div>
          <div id="usage">
              <h3 id="fourth-title">Usage</h3>
              <h3 id="fourth-first-title">Encode/Simulation/Decode</h3>
              <h3 id="fiveth-title">1	Encode</h3>
              <p id="text-content">The encode service integrates the most common and popular DNA storage encoding and verifying methods. After uploading the file, users could simply select corresponding methods, elegantly slide the sliders to set the segment length, and wait for the result. The website will not only convert the file into DNA sequences but also calculate GC content and homopolymer length as well as the minimum free energy out directly.</p>
            <div id="usage-setting">
              <h3 id="sixth-title">1.1 Setting</h3>
              <ul>
              <li><strong>Example run : </strong>The embedded example file will be encoded and corresponding results could be shown. Here, we use <i>Ping-Zhi's</i> yin-yang code and <i>Hamming</i> verify code to encode the example file.</li>
              <li><strong>Upload the storage file : </strong>You can use the demo file or your own files, but the file size is limited to less than 10M (the encoding time for large files is too long).</li>
                <li><strong>Encode Method : </strong>You can choose one of the existing popular encoding methods to encode the file, but <i>Zan's</i> code can only encode the English letters in the txt file. For more details on each method, please refers to the <a href="/methods#/methods">Method</a>. </li>
                <li><strong>Verify code : </strong>Because the DNA sequence will inevitably have errors during the storage process, in order to ensure the accuracy of data, we integrated two <strong>verify codes</strong>, which is <i>Reed Solomon Code and Hamming Code.</i></li>
                <li><strong>Segment length and Index length : </strong>The upload file will be compiled into binary data, it will be split into fixed lengths and converted to DNA sequence using the chosen method, this fixed length is the segment length. Since the existing synthesis and sequencing technology do not support long sequences, the segment length is less than 200. At the same time, in order to restore the data, each segment will add address information, and its length is the index length.</li>
                <li><strong>Run : </strong>Encode the upload file with the chosen setting parameters.</li>
              </ul>
            </div>
            <div id="usage-report">
              <h3 id="seventh-title">1.2 Report</h3>
              <ul>
                <li><strong>File information : </strong>The basic information of files uploaded by users</li>
                <li><strong>Encode information : </strong>This part shows the information of the uploaded file during encoding and the result of DNA sequences analysis after encoding.</li>
              </ul>
              <Table
              columns={columns1}
              dataSource={data1}
              size={"large"}
              pagination={{ position: ["none"],pageSize:15}}
            />
            <p id="report-content">The analysis of the encoded DNA sequences includes GC-content statics, Repeated sequence statics, and minimum free energy calculation. Here, we randomly sampled only 1000 DNA sequences for analysis.</p>
            <Image src={gc} width={"50%"} rootClassName="image3"/>
            <p id="report-content">Because the ratio of GC content is the crucial indicator of the stability of DNA sequence, we counted the GC content of each encoded DNA sequence. The X-axis is the percentage of GC content, and the Y-axis is the number of corresponding sequences.</p>
            <Image src={rp} width={"50%"} rootClassName="image4"/>
            <p id="report-content">The presence of repetitive sequences affects the accuracy of synthesis and sequence sequencing during DNA storage. So, we counted the number of repeats in the encoded DNA sequence. The X-axis is the length of the repeated sequence, and the Y-axis is the corresponding number.</p>
            <Image src={free} width={"50%"} rootClassName="image5"/>
            </div>
          </div>

      </div>
      </div>
      <div style={{position:"fixed",top:"100px",margin:"0px 20px  0px"}}>
            <Anchor targetOffset={targetOffset} onClick={scrollToAnchor} affix={false}>
              <Link href="#DNA-storage-designer" title="DNA storage designer" />
              <Link href="#what-is-it" title="What is it" />
              <Link href="#example-file" title="Example file" />
              <Link href="#usage" title="Usage">
                <Link href="#fourth-first-title" title="Encode/Simulation/Decode" />
                <Link href="#fiveth-title" title="1 Encode">
                  <Link href="#sixth-title" title="1.1 Setting" />
                  <Link href="#seventh-title" title="1.2 Report" />
                </Link>
              </Link>
              {/* <Link href="#simulation" title="3 Simulation Conditions" >
                <Link href="#synthesis" title="3.1 Synthesis" />
                <Link href="#decay" title="3.2 Decay Process" />
                <Link href="#pcr" title="3.3 PCR" />
                <Link href="#sampling" title="3.4 Sampling" />
                <Link href="#sequencing" title="3.5 Sequencing" />
              </Link>
              <Link href="#cluster" title="4 Cluster Method" >
                <Link href="#cd-hit" title="4.1 CD-HIT" />
                <Link href="#starcode" title="4.2 Starcode" />
              </Link>
              <Link href="#minimum-free" title="5 Minimum Free Energy" ></Link> */}
            </Anchor>
        </div>
    </div>
  )
};

Tutorial.defaultProps = new TutorialProps();
