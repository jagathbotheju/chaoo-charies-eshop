import { Rating } from "@mui/material";
import Heading from "./Heading";
import moment from "moment";
import Avatar from "./Avatar";

interface Props {
  product: any;
}

const ListRating = ({ product }: Props) => {
  return (
    <div>
      <Heading title="Product Review" />
      <div className="text-sm mt-2">
        {product?.reviews &&
          product.reviews.map((review: any) => {
            return (
              <div key={review.id} className="max-w-[300px]">
                <div className="flex items-center gap-2">
                  <Avatar src={review?.user.image} />
                  <p className="font-semibold">{review?.user.name}</p>
                  <p className="font-light">
                    {moment(review.createdDate).fromNow()}
                  </p>
                </div>

                <div className="mt-2">
                  <Rating value={review.rating} readOnly />
                  <p>{review.comment}</p>
                  <hr className="my-4" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ListRating;
