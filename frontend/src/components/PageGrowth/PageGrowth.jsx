import "./PageGrowth.css";

import growth1 from "../../assets/growth1.png";
import growth2 from "../../assets/growth2.png";
import growth3 from "../../assets/growth3.png";

const PageGrowth = () => {
  return (
    <section className="page-growth">

      <div className="container">

        <h2 className="growth-main-title">
          MOVIE CLIPS <span>PAGE GROWTH</span> FROM BUNDLE
        </h2>

        <div className="growth-row">

          {/* Column 1 */}
          <div className="growth-column">
            {/* <h3>Page Results From Our Bundle</h3> */}

            <div className="growth-images">
              <img src={growth1} alt="" />
              <img src={growth2} alt="" />
              <img src={growth3} alt="" />
            </div>
          </div>

          {/* Column 2 */}
          {/* <div className="growth-column">
            <h3>Page Results From Our Bundle</h3>

            <div className="growth-images">
              <img src={growth3} alt="" />
              <img src={growth4} alt="" />
            </div>
          </div> */}

          {/* Column 3 */}
          {/* <div className="growth-column">
            <h3>Page Results From Our Bundle</h3>

            <div className="growth-images">
              <img src={growth5} alt="" />
              <img src={growth6} alt="" />
            </div>
          </div> */}

        </div>

      </div>

    </section>
  );
};

export default PageGrowth;