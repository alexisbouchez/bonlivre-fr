import { StarIcon } from "@heroicons/react/solid";
import { useState } from "react";
import ReadOnlyInput from "./ReadOnlyInput";

const StarsSelect: React.FC<{ defaultValue: number }> = (props) => {
  const [stars, setStars] = useState(props.defaultValue);
  const [hoverStars, setHoverStars] = useState(0);

  return (
    <div className="flex">
      <ReadOnlyInput name="stars" value={stars} />
      {[1, 2, 3, 4, 5].map((rating) => (
        <span
          key={rating}
          onClick={() => {
            setStars(rating);
            setHoverStars(rating);
          }}
          onMouseEnter={() => setHoverStars(rating)}
          onMouseLeave={() => setHoverStars(0)}
        >
          <StarIcon
            className={`${
              (hoverStars !== 0 ? hoverStars : stars) >= rating
                ? "text-yellow-400"
                : "text-gray-300"
            } h-6 w-6 flex-shrink-0 hover:cursor-pointer`}
            aria-hidden="true"
          />
        </span>
      ))}
    </div>
  );
};

export default StarsSelect;
