import "./StickyBuyBar.css";

const StickyBuyBar = () => {
    return (
        <>

      <div className="proof-cta">

        {/* Top Badge */}
        <div className="replacement-badge">
          100% Clips Replacement (FREE)
        </div>

        <div className="container proof-flex">
          <div className="proof-left">
            <p><span>✔</span> 100% Copyright Free on FB</p>
            <p><span>✔</span> Direct Upload Without Editing</p>
            <p><span>✔</span> Pre Made Titles & Hashtags</p>
          </div>

          <button className="proof-btn">Buy Now At Just ₹149/-</button>
        </div>
        </div>
        </>
    )
}

export default StickyBuyBar;