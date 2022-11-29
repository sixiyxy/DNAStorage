import React from "react";
import "./index.less";
export class MethodsProps {}
import { Anchor } from 'antd';
import { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { Image } from 'antd';
import yinyang from '../../assets/methods/yinyang.png'
import dnafountain from '../../assets/methods/dnafountain.png'
import dnainfo from '../../assets/methods/dnainfo.png'
import nick from '../../assets/methods/nick.png'
import reedsolomon from '../../assets/methods/reedsolomon.png'
import forwarderror from '../../assets/methods/forwarderror.png'
import hierarchical from '../../assets/methods/hierarchical.png'
import synthesis from '../../assets/methods/synthesis.png'
import decay from '../../assets/methods/decay.png'
import invitro from '../../assets/methods/invitro.png'
import sequencing from '../../assets/methods/sequencing.png'
import {
  ContainerTwoTone,
} from '@ant-design/icons';
const { Link } = Anchor;
export const Methods: React.FC<MethodsProps> = (props) => {
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
  return (
    <div className="MethodContainer">
        <div className="Methods" >
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

          <h2 id="Introduction" className="first-title"> <ContainerTwoTone style={{verticalAlign: "middle"}}/> Introduction</h2>
            <p className="text-content">DNA storage designer is an online web server that provides services for whole-process DNA storage experiment design simulation and guidelines,
            from encoding, error simulation to decoding.  Undoubtedly, the very first and key step for DNA storage is the encoding process.
            Thus, we incorporate 8 encoding methods together with 2 mainstream verify codes, Reed Solomon Code and Hamming Code,
            to conduct basic error correction. To maximize the restoration of the mutations and errors that occur in real experiments,
            we embed a five-process error simulation of DNA sequence storage (including synthesis, decay, PCR, sample, and sequencing processes).
            Based on the literature, common experiment settings and conditions are provided. Users could set and simulate their experiments accordingly.
            Also, stages are optional except that synthesis is a must. Finally, if you want to decode the simulated DNA sequences,
            we utilize Starcode and Cd-hit tools to de-redundancy and cluster the sequences.

            <br/>
            <br/>
            All the mentioned methods are provided and users could choose based on your needs. The following part will introduce these methods one by one.
            Their corresponding references are also provided.
            </p>
            <br/>
            <br/>

          <h3 id="encode-method" className="second-title">1	Encoding Method</h3>
            <h4 id="vanilla-code" className="third-title">1.1 Vanilla code</h4>
              <p className="text-content"><i>Vanilla code</i> is the most basic one, it simply transforms the data according to the naive rules:
              <i>00-{'>'}A; 01-{'>'}C; 10-{'>'}G; 11-{'>'}T</i>. For example, the uploaded file which is converted into binary bits as "01 10 11 10 00 10" will be transferred to a DNA sequence ‘CGTGAG’ accordingly.
              </p>
              <h4 id="yinyang" className="third-title">1.2 Yin-Yang Code</h4>
              <p className="text-content"> The authors propose a robust transcoding algorithm named <i>the yin–yang code</i>,
              which uses two rules to encode two binary bits into one double-stranded DNA molecule,
              to generate DNA sequences that are highly compatible with synthesis and sequencing technologies.
              </p>
              <Image src={yinyang} width={"70%"} rootClassName="image"/>

              <p className="text-content"><strong>Paper: </strong>
              Ping, Z., Chen, S., Zhou, G., Huang, X., Zhu, S. J., Zhang, H., ... &Shen, Y. (2022).
              <i><strong> Towards practical and robust DNA-based data archiving using the yin-yang codec system. </strong></i>
              Nature Computational Science,2(4), 234-242.</p>
              <p className="text-content"><strong>Github: </strong>
              <a href="https://github.com/ntpz870817/DNA-storage-YYC" target="_blank" title="click me">
              https://github.com/ntpz870817/DNA-storage-YYC
              </a>
              </p>
              <h4 id="dna-fountain" className="third-title">1.3 DNA Fountain Code</h4>
              <p className="text-content"> Erlich and Zielinski present <i>DNA Fountain</i>,
              which approaches the theoretical maximum for information stored per nucleotide.
              </p>
              <Image src={dnafountain}  width={"70%"} rootClassName="image"/>

              <p className="text-content"><strong>Paper: </strong>
              Erlich, Yaniv, and Dina Zielinski.
              <i><strong> DNA Fountain enables a robust and efficient storage architecture. </strong></i>
              Science 355.6328 (2017): 950-954.</p>
              <p className="text-content"><strong>Github: </strong>
              <a href="https://github.com/TeamErlich/dna-fountain" target="_blank" title="click me">
              https://github.com/TeamErlich/dna-fountain
              </a>
              </p>
              <h4 id="dna-information" className="third-title">1.4 DNA Information Code</h4>
              <p className="text-content"> <i>DNA Information Code</i> has at least five advantages over the previous DNA storage encoding approaches.
              It encodes one bit per base (A or C for zero, G or T for one), instead of two.
              This method allows us to encode messages in many ways so that we could avoid sequences that are difficult to read or write due
              to problems like extreme GC content, repeats, and secondary structure flexibly.
              It also splits the bit stream into addressed data blocks that eliminate the need for long DNA constructs.
              </p>
              <Image src={dnainfo}  width={"45%"} rootClassName="image" />
              <p className="text-content"><strong>Paper: </strong>
              Church, G. M., Gao, Y., &Kosuri, S. (2012).
              <i><strong> Next-generation digital information storage in DNA. </strong></i>
              Science,337(6102), 1628-1628.</p>
              <p className="text-content"><strong><span style={{color:'black'}}>Code: </span></strong><strong><a href="https://www.science.org/doi/suppl/10.1126/science.1226355/suppl_file/church.sm.pdf" target="_blank" title="click me">code method</a></strong></p>


              <h4 id="nick-doldman" className="third-title">1.5 Nick Goldman Code</h4>
              <p className="text-content"> As for <i>Nick Goldman Code</i>, the bytes comprising each file were represented as single DNA sequences with no homopolymers.
              Each DNA sequence was split into overlapping segments, generating fourfold redundancy, and alternate segments were converted to their reverse complement.
              These measures reduce the occurring probability of systematic failure for any particular string, which could lead to uncorrectable errors and data loss.
              Then, each segment was augmented with indexing information that permitted the determination of the file from which it originated and its location within
              that file, and simple parity-check error detection.
              </p>
              <Image src={nick}  width={"70%"} rootClassName="image"/>
              <p className="text-content"><strong>Paper: </strong>
              Goldman, N., Bertone, P., Chen, S., Dessimoz, C., LeProust, E. M., Sipos, B., &Birney, E. (2013).  (2012).
              <i><strong> Towards practical, high-capacity, low-maintenance information storage in synthesized DNA. </strong></i>
              nature, 494(7435), 77-80.</p>
              <p className="text-content"><strong><span style={{color:'black'}}>Code: </span></strong><strong><a href="https://static-content.springer.com/esm/art%3A10.1038%2Fnature11875/MediaObjects/41586_2013_BFnature11875_MOESM337_ESM.pdf" target="_blank" title="click me">
              code method
              </a></strong>

              </p>
              <h4 id="robert" className="third-title">1.6 Robert N. Grass Code</h4>
              <p className="text-content"> This is the first encoding method to use <i>Reed-Solomon Verify Code</i>. Specifically, the procedures are as follows:
              <br/>
              1)	Two bytes of a digital file are mapped to three elements of the Galois Field of size 47 (GF(47)) by base conversion (2562 to 473 ).
              This original information is arranged in blocks of 594 39 elements.
              <br/>
              2)	In an outer encoding step, <i>Reed–Solomon (RS) codes </i>are employed to add redundancy A to the individual blocks.
              To each column, an index is added and redundancy B is generated using a second (inner) RS encoding step.
              <br/>
              3)	The individual columns are converted into DNA by mapping every element of GF(47) to three nucleotides by utilizing the GF(47)to DNA codon wheel,
              thereby guaranteeing that no base is repeated more than three times.
              <br/>
              4)	Two constant adapters are added and the resulting sequences of 158 nucleotides are synthesized.
              <br/>
              5)	 To recover the original information from the DNA, the read sequences are translated to GF(47) and are decoded by first decoding the inner code (correcting individual base errors),
              sorting the sequences by means of the index,
              followed by outer-decoding, which allows the correction of whole sequences and the recovery of completely lost sequences.
              </p>
              <Image src={reedsolomon} width={"70%"} rootClassName="image"/>
              <p className="text-content"><strong>Paper: </strong>
              Grass, R. N., Heckel, R., Puddu, M., Paunescu, D., &Stark, W. J. (2015).
              <i><strong> Robust chemical preservation of digital information on DNA in silica with error-correcting codes.</strong></i>
              Angewandte Chemie International Edition, 54(8), 2552-2555.</p>
              <h4 id="forward-error" className="third-title">1.7 Forward Error Correction Code</h4>
              <p className="text-content"> Based on a proof-of-concept conducted in 2012 by a team from the Harvard Medical School,
              the authors propose the forward error scheme,
              which is able to cope with all error types of today's DNA synthesis, amplification and sequencing processes.
              </p>
              <Image src={forwarderror}  width={"60%"} rootClassName="image"/>
              <p className="text-content"><strong>Paper: </strong>
              Blawat, M., Gaedke, K., Huetter, I., Chen, X. M., Turczyk, B., Inverso, S., ... &Church, G. M. (2016).
              <i><strong> Forward error correction for DNA data storage. </strong></i>
              Procedia Computer Science, 80, 1011-1022.</p>
              <h4 id="hierarchical" className="third-title">1.8 Hierarchical Error Correction Code</h4>
              <p className="text-content"> The hierarchical error correction strategy is proposed to store English text by DNA.
              First, a robust code book for common symbols in English text is designed,
              which can detect and correct both insertion/deletion and substitution of the nucleotides within DNA fragments.
              Then, some of the remaining errors can be corrected by multiple alignments of character sequences.
              Finally, a word spelling check is applied to further recover the file content.
              </p>
              <Image src={hierarchical}  width={"70%"} rootClassName="image"/>
              <p className="text-content"><strong>Paper: </strong>
              Zan, X., Yao, X., Xu, P., Chen, Z., Xie, L., Li, S., &Liu, W. (2022).
              <i><strong> A hierarchical error correction strategy for text DNA storage. </strong></i>
              Interdisciplinary Sciences: Computational Life Sciences, 14(1), 141-150.</p>

              <br/>
            <br/>
              <h3 id="verify-code" className="second-title">2	Verify code</h3>
              <h4 id="hamming" className="third-title">2.1  Hamming code</h4>
              <p className="text-content"> In computer science and telecommunication, <i>Hamming codes </i>are a family of linear error-correcting codes.
              <i>Hamming codes </i> can detect one-bit and two-bit errors, or correct one-bit errors without detection of uncorrected errors.
              By contrast, the simple parity code cannot correct errors, and can detect only an odd number of bits in error.
              <i>Hamming codes </i>are perfect codes, that is, they achieve the highest possible rate for codes with their block length and minimum distance of three.
              </p>

              <p className="text-content"><strong>Paper: </strong>
              Hamming, Richard W.
              <i><strong>"Error detecting and error correcting codes." </strong></i>
              The Bell system technical journal 29.2 (1950): 147-160.</p>
              <h4 id="reed-solomon" className="third-title">2.2	 Reed Solomon code</h4>
              <p className="text-content"> <i>Reed Solomon Codes</i> are a group of error-correcting codes that were introduced by Irving S.
              Reed and Gustave Solomon in 1960. They have many applications, the most prominent of which include consumer technologies such as MiniDiscs,
              CDs, DVDs, Blu-ray discs and QR codes, data transmission technologies such as DSL and WiMAX, broadcast systems such as satellite communications,
              DVB and ATSC, and storage systems such as RAID 6.
              <br/>
              Reed Solomon codes operate on a block of data treated as a set of finite-field elements called symbols.
              Reed Solomon codes are able to detect and correct multiple symbol errors. By adding <i>t = n - k</i> check symbols to the data,
              a Reed Solomon code can detect (but not correct) any combination of up to <i>t</i> erroneous symbols,
              or locate and correct up to <i>⌊t/2⌋</i> erroneous symbols at unknown locations. As an erasure code,
              it can correct up to t erasures at locations that are known and provided to the algorithm,
              or it can detect and correct combinations of errors and erasures.
              <i>Reed Solomon codes</i> are also suitable as multiple-burst bit-error correcting codes,
              since a sequence of <i>b + 1</i> consecutive bit errors can affect at most two symbols of size <i>b</i>.
              The choice of <i>t</i> is up to the designer of the code and may be selected within wide limits.
              </p>

              <p className="text-content"><strong>Wiki Page: </strong>

              <a href=" https://en.wikipedia.org/wiki" target="_blank" title="click me">
              https://en.wikipedia.org/wiki
              </a>
              </p>
              <p className="text-content"><strong>See the video: </strong>

              <a href="https://web.archive.org/web/20130313033107/http:/ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-451-principles-of-digital-communication-ii-spring-2005/lecture-notes/lecture-10-reed-solomon-codes/" target="_blank" title="click me">
              Reed–Solomon Codes MIT Lecture Notes 6.451 (Video)
              </a>
              </p>
              <br/>
            <br/>
              <h3 id="simulation" className="second-title">3	Simulation Conditions</h3>
              <h4 id="synthesis" className="third-title">3.1	Synthesis</h4>
              <p className="text-content"> During synthesis process, some molecules might not be able to be synthesized successfully,
              some might be synthesized many more times than others, which cause to imbalanced sequence number distribution.
              What’s more, varying from different methods, the error rates are different. Common methods can be grouped into two,
              <i>Column-based Oligo Synthesis(CSO)</i> and <i>Microarray-based Oligo Synthesis(MBOP)</i>. For CSO,
              errors are generated because of many reasons like low added yield, adenosine caused during acidic detritylation,
              failure to remove the dimethoxytrityle(DMT), and so on. The error rate of CSO is about 1 in 200nt or better.
              Although compared with CSO, MBOP is faster and cheaper, the error rates of oligo pools are usually higher than those for CSO because
              the mass production leads to more rough operations. Thus, several methods are proposed to overcome the problems and decrease the error rates.
              <i>DNA Storage Designer</i> provides 3 error correction methods for CSO and 5 for MBOP for users to choose from.
              </p>
              <h5 className="forth-title">- Number Distribution:</h5>
              <p className="text-content"> Due to the stochastic process like imperfect coupling, the number distribution of successfully synthesized oligos will become uneven.
              Thus, we model the changes using the binomial distribution. Specifically,
              the synthesized number of each oligo <i>n<sub>i</sub></i> is obtained by sampling from a distribution computed with coupling efficiency <i>P<sub>c</sub></i> and length <i>L</i> of sequence.
              </p>
              <h5 className="forth-title">- Methods:</h5>
              <Image src={synthesis}  width={"40%"} rootClassName="image"/>
              <p className="text-content"><strong>Paper: </strong>
              <br/>
              (1) Kosuri S, Church GM.
              <i><strong>Large-scale de novo DNA synthesis: technologies and applications. </strong></i>
              Nat Methods. 2014 May;11(5):499-507. doi: 10.1038/nmeth.2918. PMID: 24781323; PMCID: PMC7098426.
              <br/>
              (2) Michael Schwarz, Marius Welzel, Tolganay Kabdullayeva, Anke Becker, Bernd Freisleben, Dominik Heider,
              <i><strong>MESA: automated assessment of synthetic DNA fragments and simulation of DNA synthesis, storage, sequencing and PCR errors, </strong></i>
              Bioinformatics, Volume 36, Issue 11, June 2020, Pages 3322–3326, <a href="https://doi.org/10.1093/bioinformatics/btaa140" target="_blank" title="click me">
              https://doi.org/10.1093/bioinformatics/btaa140
              </a>
              </p>

              <h4 id="decay" className="third-title">3.2	Decay Process</h4>
              <p className="text-content"> In storage process, the DNA strands faces high probability to chemical decay,
              especially hydrolytic damage due to depurination and deamination.
              When the depurination will result in strand breaking and make the strand no longer read because of the loss of amplification primers,
              deamination might cause C2U and G2T mutations as well as sequence loss. Thus, the storage process can result in significant loss of whole
              DNA molecules as well as substitution errors within sequences.
              </p>
              <h5 className="forth-title">- Number Distribution:</h5>
              <p className="text-content"> For this stage, DNA Storage Designer asks the user for an overall loss rate first and will conduct distribution computation based on the binomial distribution.
              </p>
              <h5 className="forth-title">- Host Organism:</h5>
              <Image src={decay}  width={"60%"} rootClassName="image"/>
              <p className="text-content"><strong>Paper: </strong>
              <br/>
              (1) Heckel, R., Mikutis, G. & Grass, R.N.
              <i><strong> A Characterization of the DNA Data Storage Channel.  </strong></i>
              Sci Rep 9, 9663 (2019).<a href="https://doi.org/10.1038/s41598-019-45832-6" target="_blank" title="click me">
              https://doi.org/10.1038/s41598-019-45832-6
              </a>
              <br/>
              (2) Lee, H., Popodi, E., Tang, H., & Foster, P. L. (2012).
              <i><strong> Rate and molecular spectrum of spontaneous mutations in the bacterium Escherichia coli as determined by whole-genome sequencing. </strong></i>
              Proceedings of the National Academy of Sciences, 109(41), E2774-E2783.
              <br/>
              (3) Sung, W., Ackerman, M. S., Dillon, M. M., Platt, T. G., Fuqua, C., Cooper, V. S., & Lynch, M. (2016).
              <i><strong> Evolution of the insertion-deletion mutation rate across the tree of life.  </strong></i>
              G3: Genes, Genomes, Genetics, 6(8), 2583-2591.
              <br/>
              (4) Drake, J. W., Charlesworth, B., Charlesworth, D., & Crow, J. F. (1998).
              <i><strong> Rates of spontaneous mutation.</strong></i>
              Genetics, 148(4), 1667-1686.
              <br/>
              (5) Nachman, M. W., & Crowell, S. L. (2000).
              <i><strong> Estimate of the mutation rate per nucleotide in humans.</strong></i>
              Genetics, 156(1), 297-304.
              </p>
              <h5 className="forth-title">- In-Vitro:</h5>
              <Image src={invitro}  width={"20%"} rootClassName="image"/>
              <p className="text-content"><strong>Paper: </strong>
              <br/>
              (1) An, R., Jia, Y., Wan, B., Zhang, Y., Dong, P., Li, J., & Liang, X. (2014).
              <i><strong> Non-enzymatic depurination of nucleic acids: factors and mechanisms. </strong></i>
              PloS one, 9(12), e115950
              <br/>
              (2) Schwarz, M., Welzel, M., Kabdullayeva, T., Becker, A., Freisleben, B., & Heider, D. (2020).
              <i><strong> MESA: automated assessment of synthetic DNA fragments and simulation of DNA synthesis, storage, sequencing and PCR errors.</strong></i>
              Bioinformatics, 36(11), 3322-3326.
              <br/>
              </p>

              <h4 id="pcr" className="third-title">3.3	PCR</h4>
              <p className="text-content"> PCR error rates are based on the employed polymerase and the number of PCR cycles that are simulated.
              In each PCR cycle, a sequence has a possibility of <i>p</i> to be amplified. As for in-sequences and within-sequences errors,
              they are introduced mainly depend on the choice of polymerases.
              </p>
              <h5 className="forth-title">- Distribution:</h5>
              <p className="text-content">
              FThe sequence number <i>N<sub>ij</sub></i>of sequence after PCR was sampled from a distribution computed with the initial number <i>N<sub>0</sub></i>,
              replication efficiency p and PCR cycles <i>n</i>. Here, we use the normal distribution as an approximation to the real ones,
              which introduced neglectable bias under typical PCR cycles.
              </p>
              <h5 className="forth-title">- Polymerases:</h5>
              <p className="text-content">
              How extreme the effect of hydrolytic deamination highly depends on the choice of enzymes used in the PCR cycle.
              For most proofreading enzymes, because of the no complete copy it caused, many sequences would be dropped out.
              As for non-proof reading polymerase, the error rate of C2T mutation will increase. For this website, we provide four default polymerases,
              <i>Taq, Pfu, Pwo,</i> and <i>Phusion. </i>
              </p>

              <p className="text-content"><strong>Paper: </strong>
              <br/>
              (1) Yuan, L., Xie, Z., Wang, Y. et al.
              <i><strong> DeSP: a systematic DNA storage error simulation pipeline.  </strong></i>
              BMC Bioinformatics 23, 185 (2022).<a href="https://doi.org/10.1186/s12859-022-04723-w" target="_blank" title="click me">
              https://doi.org/10.1186/s12859-022-04723-w
              </a>
              <br/>
              (2) McInerney, P., Adams, P., & Hadi, M. Z. (2014).
              <i><strong> Error rate comparison during polymerase chain reaction by DNA polymerase.  </strong></i>
              Molecular biology international, 2014.
              <br/>
              </p>

              <h4 id="sampling" className="third-title">3.4  Sampling</h4>
              <p className="text-content"> Before sequencing, a proportion of DNA strands should be sampled from the main oligo pools,
              only random sequences could proceed. Thus, the sample ratio p<sub>s</sub> is the key parameter of this stage,
              and no within-sequences will be introduced. Hence, we model this stage using the binomial distribution that the sample
              ratio of each sequence is <i>p<sub>s</sub></i>
              </p>
              <h4 id="sequencing" className="third-title">3.5	Sequencing</h4>
              <p className="text-content"> In real experiments and applications, to read the data out, sequencing is a must.
              For this web server, we provide 3 kinds of prevailing sequencing platforms with corresponding methods.
              It is mentionable that substitution is the main error occurs in this stage, especially the pair-to-pair ones, TAC-TGC and CG-CA, for example.
              </p>
              <h5 className="forth-title">- Distribution:</h5>
              <p className="text-content">
              We model this stage using sequencing depth <i>D</i> together with the average copies <i>N</i> for all strands to get the sequencing ratio,
              and then a binomial distribution is conducted.
              </p>
              <h5 className="forth-title">- Method:</h5>
              <p className="text-content">
              We provide 6 sequencing methods from the literature as following:

              </p>
              <Image src={sequencing}  width={"60%"} rootClassName="image"/>

              <p className="text-content"><strong>Paper: </strong>
              <br/>
              (1) Yuan, L., Xie, Z., Wang, Y. et al.
              <i><strong> DeSP: a systematic DNA storage error simulation pipeline.  </strong></i>
              BMC Bioinformatics 23, 185 (2022).<a href="https://doi.org/10.1186/s12859-022-04723-w" target="_blank" title="click me">
              https://doi.org/10.1186/s12859-022-04723-w
              </a>
              <br/>
              (2) McInerney, P., Adams, P., & Hadi, M. Z. (2014).
              <i><strong> Error rate comparison during polymerase chain reaction by DNA polymerase.  </strong></i>
              Molecular biology international, 2014.
              <br/>
              </p>
              <br/>
            <br/>
              <h3 id="cluster" className="second-title">4	Cluster Method</h3>
              <h4 id="cd-hit" className="third-title">4.1	CD-HIT</h4>
              <p className="text-content"> The CD-HIT program takes a fasta format sequence database as input and produces a set of 'non-redundant'
              (nr) representative sequences as output. To be specific, cd-hit outputs a clustered file, documenting the sequence 'groupies' for
              each nr sequence representative. The idea is to reduce the overall size of the database without removing any sequence information
              by only removing 'redundant' (or highly similar) sequences. That is the reason the resulting database is called non-redundant (nr).
              <br/>
              CD-HIT uses a 'longest sequence first' list removal algorithm to remove sequences that are above a certain identity threshold.
              Additionally, the algorithm implements a very fast heuristic to find high identity segments between sequences,
              and so can avoid many costly full alignments.
              </p>
              <p className="text-content"><strong>Paper: </strong>
              <br/>
              (1) <i><strong> "Clustering of highly homologous sequences to reduce the size of large protein database",</strong></i>
              Weizhong Li, Lukasz Jaroszewski & Adam Godzik Bioinformatics, (2001) 17:282-283
              <br/>
              (2) <i><strong> "Tolerating some redundancy significantly speeds up clustering of large protein databases", </strong></i>
              Weizhong Li, Lukasz Jaroszewski & Adam Godzik Bioinformatics, (2002) 18:77-82
              <br/>
              (3) <i><strong> "Cd-hit: a fast program for clustering and comparing large sets of protein or nucleotide sequences", </strong></i>
              Weizhong Li & Adam Godzik Bioinformatics, (2006) 22:1658-9
              <br/>
              </p>
              <h4 id="starcode" className="third-title">4.2	Starcode</h4>
              <p className="text-content"> Starcode is a DNA sequence clustering software.
              Starcode clustering is based on all pairs search within a specified Levenshtein distance (allowing insertions and deletions),
               followed by a clustering algorithm: Message Passing, Spheres or Connected Components. Typically, a file containing a set of DNA sequences is passed as input,
               jointly with the desired clustering distance and algorithm. <i>Starcode</i> returns the canonical sequence of the cluster, the cluster size,
               the set of different sequences that compose the cluster, and the input line numbers of the cluster components.
               <br/>
              <i>Starcode</i> has many applications in the field of biology, such as DNA/RNA motif recovery, barcode/UMI clustering, sequencing error recovery, etc.
              </p>
              <p className="text-content"><strong>Paper: </strong>
              Zorita E, Cusco P, Filion GJ. 2015.
              <i><strong> Starcode: sequence clustering based on all-pairs search.</strong></i>
              Bioinformatics 31 (12): 1913-1919.
              </p>
              <br/>
            <br/>
              <h3 id="minimum-free" className="second-title">5	Minimum Free Energy </h3>
              <p className="text-content"> When DNA sequences contain two or more stretches of complementary sequences,
              DNA molecules form special spatial structures such as hairpins or topological pseudoknots (i.e., secondary structures).
              Stable secondary structures have been reported to have negative effects during DNA synthesis, sequencing and amplification.
              Energy changes can reflect the degree of secondary structure stability of DNA, and the Gibbs standard free energy is a measure of energy changes.
              Secondary structures with small Gibbs standard free energy are more stable than large Gibbs free energy. The minimum free energy (MFE) of a DNA sequence
              is the minimum of the Gibbs standard free energy of all possible secondary structures. Therefore, the quality of DNA sequences can be measured
              by calculating the MFE of each sequence. Low-MFE sequences, which are prone to secondary structures, are considered to be of poor quality.
              <br/>
              The Vienna package includes a set of computer programs and libraries for predicting the secondary structure of RNA and DNA,
              and we used one of them, RNAfold, to calculate the minimum free energy of DNA. RNAfold predicts the minimum free energy (mfe)
              structure of a single sequence using the classical algorithm of Zuker and Stiegler. A single sequence is input and RNAfold outputs
              the predicted secondary structure and the corresponding MFE. The predicted mfe structure in the output is presented as a string in the
              bracketed representation. Single stranded DNA sequences can be handled by selecting the set of DNA parameters provided by John SantaLucia.
              We provide the function to input the entire DNA sequence document to output the statistical data (including information such as mean values).
              </p>
              <p className="text-content"><strong>Paper: </strong>
              Hofacker I L.
              <i><strong> Vienna RNA secondary structure server[J]. </strong></i>
              Nucleic acids research, 2003, 31(13): 3429-3431.

              </p>
        </div>
        </div>
        {/*position:"fixed",top:"150px",margin:"0px 1100px",display:"flex" */}
        <div style={{position:"fixed",top:"100px",margin:"0px 20px  0px"}}>
            <Anchor targetOffset={targetOffset} onClick={scrollToAnchor} affix={false}>
              <Link href="#Introduction" title="Introduction" />
              <Link href="#encode-method" title="1 Encoding Method" >
                <Link href="#vanilla-code" title="1.1 Vanilla code" />
                <Link href="#yinyang" title="1.2 Yin-Yang Code" />
                <Link href="#dna-fountain" title="1.3 DNA Fountain Code" />
                <Link href="#dna-information" title="1.4 DNA Information Code" />
                <Link href="#nick-doldman" title="1.5 Nick Goldman Code" />
                <Link href="#robert" title="1.6 Robert N. Grass Code" />
                <Link href="#forward-error" title="1.7 Forward Error Correction Code" />
                <Link href="#hierarchical" title="1.8 Hierarchical Error Correction Code" />
              </Link>
              <Link href="#verify-code" title="2 Verify code" >
                <Link href="#hamming" title="2.1 Hamming code" />
                <Link href="#reed-solomon" title="2.2 Reed Solomon code" />
              </Link>
              <Link href="#simulation" title="3 Simulation Conditions" >
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
              <Link href="#minimum-free" title="5 Minimum Free Energy" ></Link>
            </Anchor>
        </div>


  </div>

  )
};

Methods.defaultProps = new MethodsProps();

