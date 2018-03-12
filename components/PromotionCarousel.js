import React from 'react';
import { Carousel } from 'antd';
import PromotionBanner from './PromotionBanner';

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

        <PromotionBanner />
        <style jsx global>{`
          .promotion-carousel {
            height: 100%;
            overflow: hidden;
            position: relative;
          }

          .promotion-carousel .ant-carousel .slick-slide {
            text-align: center;
            height: 705px !important;
            width: 100%;
            background: linear-gradient(135deg,#2b2525,#1b1515 60%,#02020e);
            {/* background: rgba(12, 12, 12, 0.7); */}
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
