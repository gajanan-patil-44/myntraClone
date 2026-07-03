import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({
  value = 0,
  onChange,
  size = 24,
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = hover ? star <= hover : star <= value;

        return (
          <Star
            key={star}
            size={size}
            fill={filled ? "#ff3f6c" : "transparent"}
            className={`cursor-pointer transition-colors ${
              filled
                ? "text-[#ff3f6c]"
                : "text-[#d4d5d9]"
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={(e)  =>{ e.stopPropagation();  onChange(star);}}
          />
        );
      })}
    </div>
  );
};

export default StarRating;