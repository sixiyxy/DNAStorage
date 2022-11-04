import React from "react";
import "./index.less";
export class MethodsProps {}
import { Anchor } from 'antd';
import { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import {
  ContainerTwoTone,
} from '@ant-design/icons';
const { Link } = Anchor;
export const Methods: React.FC<MethodsProps> = (props) => {
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);
  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);
  return (
    <div className="MethodContainer">
        <div className="Methods">
        <div id='test'>
          <br></br>
          <div>
            <Breadcrumb separator=">">
                  <Breadcrumb.Item>
                    <a href="/home">Home</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Methods</Breadcrumb.Item>
              </Breadcrumb>
          </div>
          <br/>
          <h1 id = "infotitle"> <ContainerTwoTone /> Basic Information</h1>
            <p>There are many checksum coding methods for DNA. Here we introduce the following two checksum codes and nine coding methods...</p>
          <h1 id="checkcode">Check Codes</h1>
            <h2 id="hamming">1.Hamming code</h2>
              <p>In computer science and telecommunication, Hamming codes are a family of linear error-correcting codes. 
                Hamming codes can detect one-bit and two-bit errors, or correct one-bit errors without detection of uncorrected errors. 
                By contrast, the simple parity code cannot correct errors, and can detect only an odd number of bits in error. 
                Hamming codes are perfect codes, that is, they achieve the highest possible rate for codes with their block length and minimum distance of three. 
              </p>
              <p>
                <strong>Wiki Page:</strong><a href="https://en.wikipedia.org/wiki/Hamming_code" target="_blank" title="click me"> https://en.wikipedia.org/wiki/Hamming_code</a><br/>
                <strong>Paper:</strong><a href="https://ieeexplore.ieee.org/document/6772729，PDF" target="_blank" title="click me"><em> Error detecting and error correcting codes</em></a>

              </p>
            <h2 id="reedsoloman">2.Reed Soloman</h2>
              <p>
              Reed Solomon codes are a group of error-correcting codes that were introduced by Irving S. Reed and Gustave Solomon in 1960.[1] They have many applications, 
              the most prominent of which include consumer technologies such as MiniDiscs,CDs,DVDs,Blu-raydiscs,QR codes,data transmission technologies such as DSL and WiMAX,
              broadcast systems such as satellite communications,DVB and ATSC, and storage systems such as RAID 6.<br/>
              Reed Solomon codes operate on a block of data treated as a set of finite-field elements called symbols. Reed Solomon codes are able to detect and correct multiple symbol errors. 
              By adding <em>t = n - k</em> check symbols to the data, a Reed Solomon code can detect (but not correct) any combination of up to <em>t</em> erroneous symbols, or locate and correct up to <em>⌊t/2⌋</em> erroneous symbols at unknown locations. 
              As an erasure code, it can correct up to <em>t</em> erasures at locations that are known and provided to the algorithm, or it can detect and correct combinations of errors and erasures. Reed Solomon codes are also suitable 
              as multiple-burst bit-error correcting codes, since a sequence of <em>b + 1</em> consecutive bit errors can affect at most two symbols of size <em>b</em>. The choice of <em>t</em> is up to the designer of the code and may be selected within wide limits.
              </p>
              <p>
                <strong>Wiki Page:</strong><a href="https://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction#CITEREFReedSolomon1960" target="_blank" title="click me"> https://en.wikipedia.org/wiki</a><br/>
                <strong>See the video:</strong> Reed Solomon Codes, MIT Lecture Notes 6.451 (Video)
              </p>
              <h1 id="encode">Encode Methods</h1>
                <h2 id="basic">1.Basic Code</h2>
                  <p>Transform the data according to basic rules,<q>00&#45;&gt;A; 01&#45;&gt;C; 10&#45;&gt;G; 11&#45;&gt;T</q>. For example, the uploaded file is converted into binary as <q>01 10 11 10 00 10</q> will be converted into a DNA sequence  <q>CGTGAG</q>.</p>
                <h2 id="yinyang">2.Yinyang Code</h2>
                  <p>Ping, Z., Chen, S., Zhou, G., Huang, X., Zhu, S. J., Zhang, H., ... &amp;Shen, Y. (2022). Towards practical and robust DNA-based data archiving using the yin-yang codec system. Nature Computational Science,2(4), 234-242.</p>
                  <p><strong>Details:</strong><a href="https://www.nature.com/articles/s43588-022-00231-2" target="_blank" title="click me"> Please click here to view the specific process.</a></p>
                <h2 id="fountain">3.Fountain Code</h2>
                  <p>Erlich, Yaniv, and Dina Zielinski. <q>DNA Fountain enables a robust and efficient storage architecture.</q>science 355.6328 (2017): 950-954.</p>
                  <p><strong>Details:</strong><a href="https://www.science.org/doi/abs/10.1126/science.aaj2038" target="_blank" title="click me"> Please click here to view the specific process.</a></p>
                <h2 id="church">4.Church's Code</h2>
                  <p>Church, G. M., Gao, Y., &amp;Kosuri, S. (2012). Next-generation digital information storage in DNA.Science,337(6102), 1628-1628.</p>
                  <p><strong>Details:</strong><a href="https://www.science.org/doi/abs/10.1126/science.1226355" target="_blank" title="click me"> Please click here to view the specific process.</a></p>
                <h2 id="goldman">5.Goldman's Code</h2>
                  <p>Goldman, N., Bertone, P., Chen, S., Dessimoz, C., LeProust, E. M., Sipos, B., &amp;Birney, E. (2013). Towards practical, high-capacity, low-maintenance information storage in synthesized DNA. nature, 494(7435), 77-80.</p>
                  <p><strong>Details:</strong><a href="https://www.nature.com/articles/nature11875?ntvDuo=true" target="_blank" title="click me"> Please click here to view the specific process.</a></p>
                <h2 id="grass">6.Grass's Code</h2>
                  <p>Grass, R. N., Heckel, R., Puddu, M., Paunescu, D., &amp;Stark, W. J. (2015). Robust chemical preservation of digital information on DNA in silica with error-correcting codes. Angewandte Chemie International Edition, 54(8), 2552-2555.</p>
                  <p><strong>Details:</strong><a href="https://onlinelibrary.wiley.com/doi/abs/10.1002/anie.201411378" target="_blank" title="click me"> Please click here to view the specific process.</a></p>
                <h2 id="blawat">7.Blawat's Code </h2>
                  <p>Blawat, M., Gaedke, K., Huetter, I., Chen, X. M., Turczyk, B., Inverso, S., ... &amp;Church, G. M. (2016). Forward error correction for DNA data storage. Procedia Computer Science, 80, 1011-1022.</p>
                  <p><strong>Details:</strong><a href="https://www.sciencedirect.com/science/article/pii/S1877050916308742" target="_blank" title="click me"> Please click here to view the specific process.</a></p>  
                <h2 id="zan">8.Zan's Code</h2>
                  <p>Zan, X., Yao, X., Xu, P., Chen, Z., Xie, L., Li, S., &amp;Liu, W. (2022). A hierarchical error correction strategy for text DNA storage. Interdisciplinary Sciences: Computational Life Sciences, 14(1), 141-150.</p>
                  <p><strong>Details:</strong><a href="https://github.com/KevinMusgrave/pytorch-metric-learning/blob/master/examples/notebooks/scRNAseq_MetricEmbedding.ipynb" target="_blank" title="click me"> Please click here to view the specific process.</a></p>  
                <h2 id="compositedna">9.CompositeDNA Code</h2>
                  <p>Anavy, L., Vaknin, I., Atar, O., Amit, R., &amp;Yakhini, Z. (2019). Data storage in DNA with fewer synthesis cycles using composite DNA letters. Nature biotechnology, 37(10), 1229-1236.</p>
                  <p><strong>Details:</strong><a href="https://www.nature.com/articles/s41587-019-0240-x#code-availability" target="_blank" title="click me"> Please click here to view the specific process.</a></p>  
                <br/>
                <br/>
                <br/>
                <br/>

        </div>
        </div>   
        {/*position:"fixed",top:"150px",margin:"0px 1100px",display:"flex" */} 
        <div style={{position:"fixed",top:"125px",margin:"0px 50px"}}>
            <Anchor targetOffset={targetOffset}>
              <Link href="#infotitle" title="Basic Information" />
              <Link href="#checkcode" title="Check Codes" >
                <Link href="#hamming" title="Hamming code" />
                <Link href="#reedsoloman" title="Reed Soloman" />
              </Link>
              <Link href="#encode" title="Encode Methods" >
                <Link href="#basic" title="Basic Code" />
                <Link href="#yinyang" title="Yinyang Code" />
                <Link href="#fountain" title="Fountain Code" />
                <Link href="#church" title="Church's Code" />
                <Link href="#goldman" title="Goldman's Code" />
                <Link href="#grass" title="Grass's Code" />
                <Link href="#blawat" title="Blawat's Code" />
                <Link href="#zan" title="Zan's Code" />
                <Link href="#compositedna" title="CompositeDNA Code" />
              </Link>
            </Anchor>  
        </div>
             
      
  </div>
             
  )
};

Methods.defaultProps = new MethodsProps();

