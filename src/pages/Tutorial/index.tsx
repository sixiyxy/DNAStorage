import React from "react";
import { useEffect, useState } from 'react';
import { Breadcrumb,Image,Table,Anchor} from 'antd';
import "./index.less";
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
            <Image src="/src/assets/tutorial/Home1031.png" width={"90%"} rootClassName="image1"/>
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
              We use the Xiamen University badge picture as a demo file to introduce the process of encoding, 
              simulation, and decoding of the website.
              </p>
              <Image src="/src/assets/tutorial/xiamen.png" width={"50%"} rootClassName="image2"/>
              <p id="text-content">
              Other test files can be downloaded from here.<br></br>
              The file types include: Image, video, audio, text, and binary.

              </p>
          </div>
          <div id="usage">
              <h3 id="fourth-title">Usage</h3>
              <h3 id="fourth-first-title">Encode/Simulation/Decode</h3>
              <p id="text-content">
              To enter the process <a> /home -{">"} start</a> OR <a>/services -{">"} Encode/Simulation/Decode -{">"} start</a>
              </p>
              <h3 id="fiveth-title">1	Encode</h3>
            <div id="usage-setting">
              <h3 id="sixth-title">1.1 Setting</h3>
              <ul>
                <li><strong>Upload file : </strong> You can use the example file or your own files, but the file size is limited to less than 20M (the encoding time for large files is too long).</li>
                <li><strong>Encode Method : </strong>You can choose one of the existing popular encoding methods to encode the file, but x can only encode the English letters in the txt file. For more details on each method, please refers to the “Methods” page.</li>
                <li><strong>Segment length and Index length : </strong>The upload file will be compiled into binary data, it will be split into fixed lengths and converted to DNA sequence using the chosen method, this fixed length is the segment length. Since the existing synthesis and sequencing technology do not support long sequences, the segment length is less than 200. At the same time, in order to restore the data, each segment will add address information, and its length is the index length.</li>
                <li><strong>Verify code : </strong>Because the DNA sequence will inevitably have errors during the storage process, in order to ensure the accuracy of data, we integrated two <strong>verify code</strong>, which is Reed Solomon Code and Hamming Code.</li>
                <li><strong>Example run : </strong>The embedded demo file will be encoded and corresponding results could be shown.</li>
                <li><strong>Run : </strong>Encode the upload file with the chosen setting parameters.</li>
              </ul>
            </div>
            <div id="usage-report">
              <h3 id="seventh-title">1.2 Report</h3>
              <ul>
                <li><strong>File information : </strong>The basic information of files uploaded by users</li>
                <li><strong>Encode information : </strong>This part shows the information of the uploaded file during encoding and the result of DNA sequences analysis after encoding. The analysis of the encoded DNA sequences includes GC-content statics, Homopolymer sequence statics, and min free energy calculation.</li>
              </ul>
              <Table
              columns={columns1}
              dataSource={data1}
              size={"large"}
              pagination={{ position: ["none"] }}
            />
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
