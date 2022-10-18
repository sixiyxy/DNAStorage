import { Card } from 'antd';
import React from 'react'


export default function Information(props) {
  return (
    <div>
        <Card
            style={{
                marginTop: 16,
            }}
            type="inner"
            title="DNA Encode Information"
            >
              <p>Encode method: {props.info.encode_method}</p>
              <p>Index length: {props.info.index_length}</p>
              <p>Segment length: {props.info.segment_length}</p>
              <p>Segment number: {props.info.segment_number}</p>
              <p>Verify method: {props.info.verify_method}</p>
              <p>Single DNA length: {props.dnainfo.DNA_sequence}</p>
              <p>Encoding time: {props.dnainfo.encoding_time}</p>
              <p>Information_density: {props.dnainfo.information_density}</p>
              <p>Net_information_density: {props.dnainfo.nucleotide_counts}</p>
        </Card> 
      </div>
  )
}
