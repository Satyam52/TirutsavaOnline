import React from "react";
import { Link } from "react-router-dom";
import Frame from "../frames/online-frame.png";

const OnlineEventCard = ({ height, price, eventInfo, history, match }) => {
  const img = `http://localhost:4000/events_poster/${eventInfo.name}.JPG`;
  return (
    <Link to={`/events/online/${eventInfo.eventId}`}>
      <div id="entire-card">
        <div
          style={{
            width: "100%",
            height: `${height}vh`,
            overflow: "hidden"
          }}
        >
          <div
            id="back-img"
            style={{
              backgroundImage: "url(" + Frame + ")"
            }}
          ></div>
          <div id="poster-back-online">
            <div
              id="poster"
              style={{
                backgroundImage: `url(${img})`
              }}
            >
              <div className="info-box"></div>
            </div>
          </div>

          <div
            onClick={() => console.log("we will redirect now")}
            id="event-btn"
          >
            button...
          </div>
          <div className="price-tag">Rs.{price}</div>
        </div>

        <div className="description">Hello dds</div>
      </div>
    </Link>
  );
};

export default OnlineEventCard;
