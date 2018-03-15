import React from 'react';
import config from '../config';

const { copyright, company, backup, sales, contact } = config;

const Footer = (props) => {
  return (
    <div className="footer">
      <p>{`${copyright} ${company} ${backup}`}</p>
      <p>{`销售热线：${sales} 联系电话：${contact}`}</p>

      <style jsx>{`
        .footer {
          padding: 24px 0;
        }

        p {
          text-align: center;
          font-size: 14px;
          color: #3B0000;
          line-height: 22px;
        }
      `}
      </style>
    </div>
  )
}

export default Footer;
