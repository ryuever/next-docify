import React from 'react';
import { Carousel } from 'antd';

export default class PromotionCarousel extends React.Component {
  render() {
    return (
      <div className="promotion-carousel">
        <Carousel>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Carousel>
        <style jsx global>{`
          .promotion-carousel {
            height: 100%;
            overflow: hidden;
          }

          .promotion-carousel .ant-carousel .slick-slide {
            text-align: center;
            height: 705px !important;
            width: 100%;
            background: rgba(41,44,54,1);
            overflow: hidden;
          }

          .promotion-carousel .ant-carousel .slick-dots {
            bottom: 140px;
          }

          .promotion-carousel .ant-carousel .slick-dots button{
            width: 50px;
          }

          .promotion-carousel .ant-carousel .slick-dots .slick-active button{
            width: 50px;
            background: #f5533d;
          }
        `}
        </style>
      </div>
    )
  }
}
