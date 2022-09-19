import React,{useState}from "react";
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
export class VerifyMethodProps {}

export const VerifyMethod: React.FC<VerifyMethodProps> = (props) => {
    const [disabled, setDisabled] = useState(false);

    const onChange = (checkedValues: CheckboxValueType[]) => {
        // const findopt = options.filter((opt)=>{
        //     return opt.label !== checkedValues[0]
        // })
        // setDisabled(Boolean(findopt[0].disable))
        // setDisabled(Boolean(findopt[1].disable))
        // console.log(findopt[0]);
        // console.log(findopt[1]);
        console.log('checked = ', checkedValues);
      };
      
      const options = [
        { label: 'WithoutVerifycode', value: 'Without Verify code',disable:'false'},
        { label: 'HammingCode', value: 'HammingCode',disable:'flase'},
        { label: 'ReedSolomonCode', value: 'Reed Solomon Code',disable:'flase'},
      ];
      
    return(
        <>
        <Checkbox.Group options={options} onChange={onChange} disabled={disabled} />
        </>
    );
};
VerifyMethod.defaultProps = new VerifyMethodProps();