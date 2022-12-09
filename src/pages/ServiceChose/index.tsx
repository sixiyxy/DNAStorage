import { Button, Card } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./index.less";
import serviceAll from "../../assets/service/serviceAll.png";
import serviceEncode from "../../assets/service/serviceEncode.png";
import serviceSimu from "../../assets/service/serviceSimu.png";

export class ServiceChoseProps {}

export const ServiceChose: React.FC<ServiceChoseProps> = (props) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Card className="service-choose-card">
        <img src={serviceEncode} />
        <p>
          The encode service integrates the most common and popular DNA storage encoding and
          verifying methods. After uploading the file, users could simply select corresponding
          methods, elegantly set the segment length, and wait for the result.
        </p>
        <div className="button">
          <Link to="/services/encode">
            {/*<Button type="primary">Start</Button>*/}
            <Button type="primary" shape="round" size="large">
              Start
            </Button>
          </Link>
        </div>
      </Card>
      <Card className="service-choose-card">
        <img src={serviceAll} />
        <p>
          This module helps the user to go through the complete stages of DNA storage, encoding,
          error simulation, and decoding. As long as users upload the original files they want to
          encode and choose the corresponding methods and platforms, they could easily see how their
          files change through each process based on the website report.
        </p>
        <div className="button">
          <Link to="/services/wholeprocess">
            <Button type="primary" shape="round" size="large">
              Start
            </Button>
          </Link>
        </div>
      </Card>
      <Card className="service-choose-card">
        <img src={serviceSimu} />
        <p>
          The simulation service allows user to upload their own fasta DNA file to proceed error
          simulation stage. It covers the five stages of DNA storage, namely, synthesis, storage
          decay, PCR, sampling, and sequencing.
        </p>
        <div className="button">
          <Link to="/services/simulation">
            <Button type="primary" shape="round" size="large">
              Start
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

ServiceChose.defaultProps = new ServiceChoseProps();
