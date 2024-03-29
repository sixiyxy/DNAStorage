import React from "react";
import { useEffect, useState } from "react";
import { Breadcrumb, Image, Table, Anchor } from "antd";
import "./index.less";
import Home1031 from "../../assets/tutorial/home.png";
import xiamen from "../../assets/tutorial/demo.png";
import gc from "../../assets/tutorial/gc.png";
import rp from "../../assets/tutorial/rp.png";
import free from "../../assets/tutorial/free.png";
import simubtn from "../../assets/tutorial/simubtn.png";
import SYN from "../../assets/tutorial/SYN.png";
import simutab from "../../assets/tutorial/simutab.png";
import simuseq from "../../assets/tutorial/simuseq.png";
import copynumber from "../../assets/tutorial/copynumber.png";
import simucounts from "../../assets/tutorial/simucounts.png";
import dnatable from "../../assets/tutorial/dnatable.png";
import { Link } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { Link as RouterLink } from "react-router-dom";
import { API_PREFIX } from "../../common/Config";
import axios from "axios";
export class TutorialProps {}

// const { Link } = Anchor;
export const Tutorial: React.FC<TutorialProps> = (props) => {
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);
  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
    // window.scrollTo(0,0);
  }, []);

  const scrollToAnchor = (e, link) => {
    e.preventDefault();

    if (link.href) {
      const anchorElement = document.getElementById(link.href);
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }
  };
  interface DataType {
    key: string;
    name1: string;
    value1: any;
  }
  interface DataType3 {
    key: string;
    p:string;
    i:string;
    ip:string;
    ipv:string;
    dna:string;
  }
  const columns1: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name1",
      width: "55%",
      // render: (text) => <a>{text}</a>,
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
      value1: "user choice",
    },
    {
      key: "2",
      name1: "Segment lenth",
      value1: "user choice",
    },
    {
      key: "3",
      name1: "Index length",
      value1: "user choice",
    },
    {
      key: "4",
      name1: "Verify method",
      value1: "user choice",
    },
    {
      key: "5",
      name1: "Segment number",
      value1: "the total number of segments after the file is split",
    },
    {
      key: "6",
      name1: "Encode time",
      value1: "time spend in encoding uploaded file",
    },
    {
      key: "7",
      name1: "Single DNA length",
      value1: "the length of each dna sequence which encodes form segment bits",
    },
    {
      key: "8",
      name1: "DNA sequence number",
      value1:
        "each segment will be encoded as DNA sequence, here is the total number of dna sequences",
    },
    {
      key: "9",
      name1: "Nucleotide counts",
      value1: "the number of bases in all DNA sequences",
    },
    {
      key: "10",
      name1: "Information density",
      value1: "the ratio of nucleotide counts to file bits",
    },
    {
      key: "11",
      name1: "Physical information density",
      value1:
        "The ratio of file bytes to the total mass of DNA sequences (Define 1.5pmol * 1000bp = 9.03 * 10^14bp = 1ug)",
    },
  ];
  const columns2: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name1",
      width: "55%",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Information",
      dataIndex: "value1",
      align: "center",
    },
  ];
  const data2: DataType[] = [
    {
      key: "1",
      name1: "Decode time",
      value1: "decode time",
    },
    {
      key: "2",
      name1: "Clustering method",
      value1: "starcode/cd-hit, which will be used for clustering simulation dna sequences",
    },
    {
      key: "3",
      name1: "Clustering time",
      value1: "clustering time",
    },
    {
      key: "4",
      name1: "Encode DNA sequence number",
      value1: "the number of dna sequences encoded in the uploaded file",
    },
    {
      key: "5",
      name1: "Simulation DNA sequence number",
      value1: "the number of dna sequences encoded in uploaded files after error simulation",
    },
    {
      key: "6",
      name1: "Clustering DNA sequence number",
      value1: "the number of error simulated DNA sequences after clustering",
    },
    {
      key: "7",
      name1: "Recall DNA sequence number",
      value1: "the number of correct coding dna sequences if clutering sequences",
    },
    {
      key: "8",
      name1: "Recall rate",
      value1: "the correct dna sequence recall ratio",
    },
    {
      key: "9",
      name1: "Encode segment bits number",
      value1: "the number of segments before encode",
    },
    {
      key: "10",
      name1: "Decode segment bits number",
      value1: "the segment obtained after decoding using the clustered dna sequences",
    },
    {
      key: "11",
      name1: "Recall segment bits number",
      value1: 'the number of correct decode segment in "encode segment bits',
    },
    {
      key: "12",
      name1: "Recall bits rate",
      value1: 'the ratio of correct decode segment in "encode segment bits',
    },
  ];
  const columns3: ColumnsType<DataType3> = [
    {
      title: "payload",
      dataIndex: "p",
      align: "center",
      // width: "55%",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "index",
      dataIndex: "i",
      align: "center",
    },
    {
      title: "index_payload",
      dataIndex: "ip",
      align: "center",
    },
    {
      title: "index_payload_verifycode",
      dataIndex: "ipv",
      align: "center",
    },
    {
      title: "DNA_sequence",
      dataIndex: "dna",
      align: "center",
    },
  ];
  const data3: DataType3[] = [
    {
      key: "1",
      p: "100010010…",
      i: "101011…",
      ip:"101011100010010…",
      ipv:"10101110001001000…",
      dna:"TAAGACC…"
    },
    {
      key: "2",
      p: "100101001...",
      i: "100000...",
      ip:"100000100101001...",
      ipv:"10000010010100111...",
      dna:"TAAAGTC…"
    },
  ];
  const handelURL=()=>{
    console.log('请求地址中');  
    axios
      .post(API_PREFIX + "/download", {type:'demo',file_uid:'demo'}, { responseType: "blob" })
      .then(function (response) {
        console.log(response.data);
        const link = document.createElement("a"); //创建一个a标签
        const blob = new Blob([response.data]); //实例化一个blob出来
        link.style.display = "none";
        link.href = URL.createObjectURL(blob); //将后端返回的数据通过blob转换为一个地址
        //设置下载下来后文件的名字以及文件格式
        link.setAttribute(
          "download",
          `Demo-Files.`+ `${"zip"}` //upload为下载的文件信息 可以在外层包一个函数 将upload作为参数传递进来
        );
        document.body.appendChild(link);
        link.click(); //下载该文件
        document.body.removeChild(link);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <div className="tutorial-container">
      <div className="tutorial">
        <div className="tutorial-content">
          <div className="Breadcrumb">
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <RouterLink to="/home">Home</RouterLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Tutorial</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div id="what-is-it">
            <h3 id="second-title">What is it</h3>
            <p id="text-content">
              With the total amount of worldwide data skyrocketing, traditional storage methods face
              daunting challenges. The international data storage demand will far exceed the storage
              capacity of any currently available storage method. DNA molecules as information
              carriers have many advantages over traditional storage media. Its high storage
              density, potentially low maintenance cost and other excellent characteristics make it
              an ideal alternative medium for information storage, and is expected to provide wide
              practicality in the future. DNA Storage Designer is an easy-to-use online web server
              that covers the simulation of the whole process of DNA storage application. It
              includes 8 popular encoding methods and realized the corresponding decoding process.
              In addition, it also simulates the sequence errors in the five DNA sequence storage
              processes of synthesis, decay, PCR, sample, and sequencing. Users can not only use
              independent encode modules to encode files and obtain DNA sequences for vivo/in vivo
              storage experiments, but also upload DNA sequences to simulate sequence errors during
              storage by the 'Error Simulation' module. Aiming to provide user-friendly services,
              this website embeds the most popular methods and platforms related to DNA storage
              instead of asking users for complex parameters. It also gives thorough guidelines and
              simulated feedback based on user settings so that user could adjust their experimental
              plan according to the feedback report.
            </p>
          </div>
          <div id="DNA-storage-designer">
            <Image src={Home1031} width={"80%"} rootClassName="image1" />
            <p style={{ textAlign: "center", fontSize: 13 }}>Figure 1: DNA storage designer</p>
          </div>

          <div id="example-file">
            <h3 id="third-title">Example file</h3>
            <p id="text-content">
            We use <i>Monet Claude's "Impression,Sunrise</i> .jpg" picture as an example file to introduce the working process of the website. 
            Here, we utilize <i>Ping-Zhi's</i> yin-yang method to encode the example file, and the default parameters to perform error simulation on the encoded DNA sequence. 
            Other demo files can be <a href="javascript:void(0)" onClick={handelURL} id='a-link'>downloaded from here.</a> The file types include: Image, video, audio, text, and binary.
            </p>
            <Image src={xiamen} width={"50%"} rootClassName="image2" />
            <p style={{ textAlign: "center", fontSize: 13 }}>Figure 2: Example file</p>
            {/* <p id="text-content">
              Other demo files can be downloaded from here. The file types include: Image, video,
              audio, text, and binary.
            </p> */}
          </div>
          <div id="usage">
            <h3 id="fourth-title">Usage</h3>
            <h3 id="fourth-first-title">1 Encode/Simulation/Decode</h3>
            <h3 id="fiveth-title">1.1 Encode</h3>
            <p id="text-content">
              The encode service integrates the most common and popular DNA storage encoding and
              verifying methods. After uploading the file, users could simply select corresponding
              methods, elegantly slide the sliders to set the segment length, and wait for the
              result. The website will not only convert the file into DNA sequences but also
              calculate GC content and homopolymer length as well as the minimum free energy out
              directly.
            </p>
            <div id="usage-setting">
              <h3 id="sixth-title">1.1.1 Setting</h3>
              <ul>
                <li>
                  <strong>Example run: </strong>The embedded example file will be encoded and
                  corresponding results could be shown. Here, we use <i>Ping-Zhi's</i> yin-yang code
                  and <i>Hamming</i> verify code to encode the example file.
                </li>
                <li>
                  <strong>Upload the storage file: </strong>You can use the demo file or your own
                  files, but the file size is limited to less than 10M (the encoding time for large
                  files is too long).
                </li>
                <li>
                  <strong>Encode Method: </strong>You can choose one of the existing popular
                  encoding methods to encode the file, but <i>Zan's</i> code can only encode the
                  English letters in the txt file. For more details on each method, please refers to
                  the <Link to="/methods">Method</Link>.{" "}
                </li>
                <li>
                  <strong>Verify code: </strong>Because the DNA sequence will inevitably have errors
                  during the storage process, in order to ensure the accuracy of data, we integrated
                  two <strong>verify codes</strong>, which is{" "}
                  <i>Reed Solomon Code</i> and <i>Hamming Code</i>. For more details on each method, please
                  refers to the <Link to="/methods">Method</Link>.
                </li>
                <li>
                  <strong>Segment length and Index length: </strong>The upload file will be compiled
                  into binary data (each byte will be converted to 8 bits ), it will be split into fixed lengths (segment length) and converted to DNA
                  sequence using the chosen method. Since
                  the existing synthesis and sequencing technology do not support long sequences,
                  the segment length should be less than 200. At the same time, in order to restore
                  the data, each segment will be added on address information, and the length is the
                  index length (the length is automatically inferred based on the file size).
                </li>
                <li>
                  <strong>Run: </strong>Encode the upload file with the chosen setting parameters.
                </li>
              </ul>
            </div>
            <div id="usage-report">
              <h3 id="seventh-title">1.1.2 Report</h3>
              <ul>
                <li>
                  <strong>File information: </strong>The basic information of files uploaded by
                  users.
                </li>
                <li>
                  <strong>Encode information: </strong>This part shows the information of the
                  uploaded file during encoding and the result of DNA sequences analysis after
                  encoding.
                </li>
                <Table
                  columns={columns1}
                  dataSource={data1}
                  size={"large"}
                  pagination={{ position: ["none"], pageSize: 15 }}
                />
                <p id="report-content">
                  The analysis of the encoded DNA sequences includes GC content statics, repeated
                  sequence statics, and minimum free energy calculation. Here, we randomly sampled
                  only 1000 DNA sequences for analysis.
                </p>
                <Image src={gc} width={"50%"} rootClassName="image3" />
                <p style={{ textAlign: "center", fontSize: 13 }}>Figure 3: GC content diagram</p>
                <p id="report-content">
                  Because the ratio of GC content is the crucial indicator of the stability of DNA
                  sequence, we counted the GC content of each encoded DNA sequence. The X-axis is
                  the percentage of GC content, and the Y-axis is the number of corresponding
                  sequences.
                </p>
                <Image src={rp} width={"50%"} rootClassName="image4" />
                <p style={{ textAlign: "center", fontSize: 13 }}>Figure 4: Homopolymer diagram</p>
                <p id="report-content">
                  The presence of repetitive sequences affects the accuracy of synthesis and
                  sequence sequencing during DNA storage. So, we counted the number of repeats in
                  the encoded DNA sequence. The X-axis is the length of the repeated sequence, and
                  the Y-axis is the corresponding number.
                </p>
                <Image src={free} width={"50%"} rootClassName="image5" />
                <p style={{ textAlign: "center", fontSize: 13 }}>
                  Figure 5: Minimum free energy diagram
                </p>
                <p id="report-content">
                  <strong>The sequence average minimum free energy is: -5.82</strong>
                  <br></br>
                  The minimum free energy (MFE) of a DNA sequence is the minimum of the Gibbs
                  standard free energy of all possible secondary structures. Therefore, the quality
                  of DNA sequences can be measured by calculating the MFE of each sequence. Here we
                  calculated the MFE if randomly selected 1000 encoded DNA
                  sequences by RNAfold (see <Link to="/methods">Method</Link>).<br></br>
                  <br></br>
                  <pre id="code_block">
                    Here we use the RNAfold command is:<br></br>
                    <code>
                      {
                        "{RNAfold} --noPS --noGU --noconv -T 59.1 < {encode dna sequence file} > {outfile}"
                      }
                    </code>
                  </pre>
                </p>
                <li>
                  <strong>Download: </strong>Include two files in the downloaded compressed file, one is the encoding settings information of the uploaded file (namely as file_id.yaml), and the other is the encoded DNA sequence file (namely as file_id.fasta).
                  <ul>
                    <li><strong>Information file (yaml):</strong> This information file contains the related settings  and report information of the uploaded file.</li>
                    <li><strong>Encode sequences (fasta):</strong> This file contains the encoded dna sequences of the uploaded file. The information of each sequence is the corresponding segment payload data (after file segment), and the id is the corresponding index(address bits). </li>
                    {/* <li><strong>Upload file encode details (txt):</strong> This file contains detailed information about: payload (after file segment), index (address bits), index_payload (payload and index bits), index_payload_verifycode (payload,index,verifycode bits), DNA_sequence.</li> */}
                  </ul>
                </li>
                <pre id="code_block" style={{margin:"20px"}}>
                    <code>
                      
                       {">"}1 | 000001000101001100010… (payload)<br></br>CAGTCATGCCAACAGTAATTGTGATAAACGTTCCGCTATGCCTCATTTCCTTGGAATTGTGCTACGCTTTAGACCGGACTCTAC<br></br>
                       {">"}2 | 010010100000000001101… (payload)<br></br>AACGATTAATCTCAGTAAGGAGACGGGCAATGAGTTGTAGTAGGTTCGTAAATCCGCATTCATTCTGTCAGGTTCCCCGTGGCA<br></br>
                       ...
                      
                    </code>
                  </pre>
              </ul>
              {/* <Table
                  columns={columns3}
                  dataSource={data3}
                  size={"small"}
                  pagination={{ position: ["none"]}}
                /> */}
            </div>
            <div id="errorsimu">
              <h3 id="fiveth-title">1.2 Error Simulation</h3>
              <div id="simu-setting">
                <h3 id="sixth-title">1.2.1 Settings</h3>
                <ul>
                  <li>
                    <strong>Example: </strong>An example is embedded in this part based on the
                    previous encoding example, and all the simulation settings are using the default
                    ones.
                  </li>
                  <li>
                    <strong>Stages Setting: </strong>We list out five processes, namely, synthesis,
                    decay (storage), PCR, sampling, and sequencing. You could decide whether these
                    stages are needed or not to get a final workflow based on your experiment
                    design. By default, all stages are simulated. <strong>If you want to skip some of them,
                    you could click on the corresponding buttons.</strong> However, because the synthesis of
                    sequences is the base of the following stages, this stage is a must for the
                    simulation part and can not be ignored. After your decision is done, please
                    click the OK button to start your detailed settings.
                  </li>
                  <Image src={simubtn} width={"80%"} rootClassName="image6" />
                  <p style={{ textAlign: "center", fontSize: 13 }}>
                    Figure 6: Simulation stage settings
                  </p>
                  <li>
                    <strong>Detail Settings: </strong>Because the errors that occur in stages have
                    accumulative effects, the execution order of stages is fixed. You should set the
                    stages accordingly. For each parameter, you could hover your mouse over the
                    question mark aside, the explanation will be popped out. As for the settings
                    with provided options, you could see their corresponding short introduction and
                    references from the “Methods” page. After setting up parameters for one stage,
                    please click on the OK button to confirm.{" "}
                  </li>
                  <Image src={SYN} width={"40%"} rootClassName="image6" />
                  <p style={{ textAlign: "center", fontSize: 13 }}>
                    Figure 7: Sample of hovering information
                  </p>
                </ul>
                <p id="simuset-report">
                  And the sequence distribution changes result of this stage will be shown instantly
                  right. This diagram shows the sequence number distribution of oligonucleotides
                  pool, which explains the density of DNA strands.{" "}
                </p>
                <Image src={copynumber} width={"40%"} rootClassName="image6" />
                <p style={{ textAlign: "center", fontSize: 13 }}>
                  Figure 8: Sequence distribution diagram
                </p>
                <p id="simuset-report">
                  To be specific, for example, if we have an original sequence<i> M </i>at first,
                  after 10 cycle synthesis, we may get 10 copies for <i>M</i>, among them, some may
                  be embedded with simulated errors (
                  <i>
                    M<sub>1</sub>
                  </i>
                  , 
                  <i>
                     M<sub>2</sub>
                  </i>
                  ).
                </p>
                <Image preview={false} src={dnatable} width={"60%"} rootClassName="image6" />
                {/* <p style={{ textAlign: "center", fontSize: 13 }}>
                  Figure 9: Example of simulated situation of <i>M</i>
                </p> */}
                <p id="simuset-report">
                  Thus, for this example, in this stage, most DNA strands have a copy number around
                  10, while strands with 1 or 2 copy number also exist. Therefore, the diagrams will
                  help you to intuitively understand the density change of chains in nucleic acid
                  pool. Then, you could move to the next stage.
                </p>
                <p id="simuset-report">
                  After all the stages are done and the diagrams are shown, please click on the
                  report button to get the overall result and summary.{" "}
                </p>
              </div>
              <div id="simu-report">
                <h3 id="seventh-title">1.2.2 Report</h3>
                <p id="text-content">
                  The report consists of three parts, Steps Review, Sequences Distribution, and
                  Error Counts. You could also download the simulated file together with the setting
                  information using the “Download” button.{" "}
                </p>
                <ul>
                  <li>
                    <strong>Steps Review: </strong>This part lists out the choices you made in the
                    setting part. Also, it uses pie charts to uncover the distribution of different
                    error types of corresponding chosen methods. You could click on the stages and
                    double-check previous settings.
                  </li>
                  <Image src={simutab} width={"75%"} rootClassName="image6" />
                  <p style={{ textAlign: "center", fontSize: 13 }}>
                    Figure 9: Example of steps review
                  </p>
                  <li>
                    <strong>Sequence Distribution: </strong>During the whole process, the number of
                    sequences, causes of errors and proportions of different types of errors change
                    from time to time. Therefore, we counted and compared the numbers of DNA strands
                    with errors and the left 100% correct DNA strands for each stage using a stacked
                    column chart, as well as showed the changes in the strand numbers that contained
                    different types of errors using line charts. Since the difference between the
                    data is too large, each value y here is presented using ln(y).
                  </li>
                  <p></p>
                  <p id="simudia-report">
                    From this chart, vertically, you could compare the ratio of modified strands to
                    original ones and count of different error types for each stage. As for
                    horizontally study, you could see that the total number of DNA strands, the
                    ratio of strands with simulated errors to correct strands, and the number of
                    simulated errors of different types vary with the stages.
                  </p>
                  <Image src={simuseq} width={"75%"} rootClassName="image6" />
                  <p style={{ textAlign: "center", fontSize: 13 }}>
                    Figure 10: Example of sequence distribution diagram
                  </p>
                  <li>
                    <strong>Error Counts: </strong>Because the effects of occurred errors are
                    cumulative, it is reasonable that as the simulation proceeds, both the
                    percentage of strands with errors as well as the average error number for all
                    strands will increase. Thus, we count the number of strands with a different
                    number of errors for the different stages as shown above. As we could see, the
                    later the stage is, the higher the number of chains with errors is. Different
                    colors here stand for different number of errors contained in the strands.
                  </li>
                  <Image src={simucounts} width={"75%"} rootClassName="image6" />
                  <p style={{ textAlign: "center", fontSize: 13 }}>
                    Figure 11: Example of error counts diagram
                  </p>
                  <li>
                    <strong>Download: </strong>After clicking on the download button, a zip folder
                    containing simulated DNA sequences and an information YAML file will be
                    downloaded automatically.
                  </li>
                  <ul>
                    <li>
                      <strong>Simulated DNA Sequences: </strong>This file is in fasta format. The
                      label of each sequence contains the error simulation results. For example, “
                      {">"}11079 | [(77, 's', 'T'), (23, '+', 'C'), (36, '-', 'A')]” means, the 77th
                      base, “T”, of 11079th sequence has been substituted, 23rd position has
                      inserted a 'C', and the 'A' on 36th has been deleted.{" "}
                    </li>
                    <li>
                      <strong>Information File: </strong>This information file contains the related
                      settings of the uploaded file, from encoding to simulation part, all
                      information is included.{" "}
                    </li>
                  </ul>
                </ul>
              </div>
            </div>
            <div id="decode">
              <h3 id="decode-title1">1.3 Decode</h3>
              <p id="text-content">
              In this last stage, we need to decode the simulated DNA sequences according to the reverse rules of the encoding ones. 
              However, DNA strands passed to this stage usually have random errors( insertion\indeletion\substitution, we have simulated this). 
              So, we embedded two clustering algorithms, CD-HIT and Starcode, to remove redundancy and correct the data. 
              Then, the clustered sequences will be decoded to obtain bit fragments. 
              Subsequently, the the verification code and index code are removed from the bit fragments. 
              Finally, we analyze the recovery information of bit fragments in the report.
              </p>
              <h3 id="decode-title2">1.3.1 Clustering algorithms</h3>
              <pre id="code_block">
                <p id="simuset-report">
                  Starcode command: <br></br>
                  <code>
                    {"{starcode} -d 4 -s -t {threads} -i {simulation_dna_file} -o {out_file}"}
                  </code>
                </p>
                <p id="simuset-report">
                  Cdhit command: <br></br>
                  <code>
                    {"{cd-hit} -T {threads} -c 0.99 -i {simulation_dna_file} -o {out_file}"}
                  </code>
                </p>
              </pre>
              <p id="simuset-report">
                method details please click the <Link to="/methods">Method</Link>
              </p>
              <h3 id="decode-title3">1.3.2 Result</h3>
              <Table
                columns={columns2}
                dataSource={data2}
                size={"large"}
                pagination={{ position: ["none"], pageSize: 15 }}
              />
            </div>
          </div>
          <div id="usage">
            <h3 id="Error-Simulation">2 Error Simulation</h3>
            <p id="text-content">
              Except for dealing with DNA sequences encoded by ourselves, we also provide a separate
              error simulation part for users to conduct their experiments. To begin with, you could
              simply upload your own FASTA file. In consideration of computation cost, the maximum
              original sequences number we accept is 200000 in the simulation part.
              <br></br>
              And as for other details, please refer to the “1.2 Error Simulation” part.{" "}
            </p>
            {/* <p id="text-content"> */}
             
            {/* </p> */}
            <h3 id="File-Encode">3 File Encode</h3>
            <p id="text-content">
              If the user just wants to encode the file, we also provide a separate file encode
              part, it is not necessary for you to go through the whole process. <br></br>And as for other
              details, please refer to the “1.1 Encode” part.{" "}
            </p>
            <h3 id="Frequently">Frequently Asked Questions</h3>
            <ul>
              <li>
                <strong>Which file types can users encode with?</strong>
              </li>
              <p id="text-content">
                Zan's code can only encode the English letters in the txt file. Other methods can
                encode any file that can be compiled to binary. Therefore, pictures, videos, audios
                and txt file types are all allowed.
              </p>
              <li>
                <strong>Why the file size cannot exceed 6M?</strong>
              </li>
              <p id="text-content">
                In fact, file lager than 6M can be processed, but the backend processing time is
                too long, so we limit the file size.
              </p>
              <li>
                <strong>
                  Why can't the 'Ping-zhi's yin-yang code' and 'Erlich's fountain code' method be
                  used for files smaller than 100kb?
                </strong>
              </li>
              <p id="text-content">
                Because these two methods need to use the 'bits sequence' after file segmentation,
                and combined encoding to find the qualified DNA sequence. If the file is too small,
                the screened pool will be too small to perform reasonable encoding.
              </p>
              <li>
                <strong>
                  What is FASTA format file?
                </strong>
              </li>
              <p id="text-content">
                In bioinformatics area, FASTA is the most commonly accepted text-based format for representing nucleotide sequences, 
                which uses single-letter codes to present nucleotides. Strating with a "{">"}" symbol, a description of the following sequence
                will be given. And the lines beneath are the said sequence before where the next "{">"}" symbol starts. 
              </p>
              <li>
                <strong>
                  How the errors be simulated?
                </strong>
              </li>
              <p id="text-content">
                Generally, errors occur in DNA storage projects come from two aspects: within-sequences errors and between-sequences errors.
                The former one refers to errors like insertion, deletion and substitution for bases in sequences which may lead to wrong information. The later one, between-sequences errors, means the change of sequence distributon and even 
                sequence lost. With-in sequences errors are often introduced by and varying from the methods or platforms used, whereas the distribution changes relates to human operations, for example,
                sampling ratio, sequencing depth, etc. Thus, we design our error simulation parts in the combined way to help users most. 
              </p>
            </ul>
            <div id="Acknowledgment">
              <h3 id="fourth-title">Acknowledgment</h3>
              <p id="text-content">
                <strong>Funding: </strong>This work is being supported by Open Research Projects of Zhejiang Lab (2022RD0AB02), and the National Key R\&D Program of China (2017YFE0130600).
              </p>
              <p id="text-content">
                <strong>Conflict of Interest: </strong>The authors declare that the research was
                conducted in the absence of any commercial or financial relationships that could be
                construed as a potential conflict of interest.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "fixed", top: "100px", margin: "0px 20px  0px" }}>
        <Anchor targetOffset={targetOffset} onClick={scrollToAnchor} affix={false}>
          <Anchor.Link href="#what-is-it" title="What is it" />
          <Anchor.Link href="#example-file" title="Example file" />
          <Anchor.Link href="#usage" title="Usage">
            <Anchor.Link href="#fourth-first-title" title="1 Encode/Simulation/Decode" >

                <Anchor.Link href="#fiveth-title" title="1.1 Encode">
                  <Anchor.Link href="#sixth-title" title="1.1.1 Setting" />
                  <Anchor.Link href="#seventh-title" title="1.1.2 Report" />
                </Anchor.Link>

                <Anchor.Link href="#errorsimu" title="1.2 Error Simulation">
                  <Anchor.Link href="#simu-setting" title="1.2.1 Setting" />
                  <Anchor.Link href="#simu-report" title="1.2.2 Report" />
                </Anchor.Link>

                <Anchor.Link href="#decode" title="1.3 Decode">
                  <Anchor.Link href="#decode-title2" title="1.3.1 Clustering algorithms" />
                  <Anchor.Link href="decode-title3" title="1.3.2	Result" />
                </Anchor.Link>
            </Anchor.Link>  
            <Anchor.Link href="#Error-Simulation" title="2 Error Simulation" />
            <Anchor.Link href="#File-Encode" title="3 File Encode" />
          </Anchor.Link>
          <Anchor.Link href="#Frequently" title="Frequently Asked Questions" />
          <Anchor.Link href="#Acknowledgment" title="Acknowledgment" />
        </Anchor>
      </div>
    </div>
  );
};

Tutorial.defaultProps = new TutorialProps();
