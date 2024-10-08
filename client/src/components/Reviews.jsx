import React from "react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Reviews = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
         responsive: [
            {
                breakpoint: 768, 
                settings: {
                    slidesToShow: 1, 
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                }
            }
        ]
    };

    const reviews = [
        { id: 1, name: "John Doe", review: "This is a great app!" },
        { id: 2, name: "Jane Smith", review: "Very useful and easy to use." },
        { id: 3, name: "Alice Johnson", review: "Highly recommend this to everyone. A great platform for both finding and posting tasks. Very intuitive!" },
        { id: 4, name: "Alex Jones", review: "A fantastic tool for managing tasks." },
        { id: 5, name: "Peter Norris", review: "It has helped me stay organized." },
        { id: 6, name: "Simon Owens", review: "Love the features and the design." }
    ];

    return (
        <div className="reviews-section">
            <h1>User Reviews</h1>
            <Slider {...settings}>
                {reviews.map(review => (
                    <div key={review.id} className="review">
                        <h3>{review.name}</h3>
                        <p>{review.review}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );

}

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "black" }}
            onClick={onClick}
        />
    );
}

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "black" }}
            onClick={onClick}
        />
    );
}

export default Reviews;
