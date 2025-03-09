import React from "react";

const CustomIcon = (props) => {
  const { src, color, size = "16", className, cursor = "pointer", name, ...rest } = props;

  return (
    <>
      {!!color ? (
        <span className={className} style={{ width: size, height: size }}>
          <style>{`
            .iconStyle-${name} {
              cursor: ${cursor};
              width: ${size}px;
              height: ${size}px;
              background: ${color};
              mask-image: url(${src});
              -webkit-mask-image: url(${src});
              // mask-box-image: url(${src});
              // webkit-mask-box-image: url(${src});
              mask-repeat: no-repeat;
              -webkit-mask-repeat: no-repeat;
              mask-size: contain;
              -webkit-mask-size: contain;
              object-fit: cover;
              display: inline-block;
              transition: 0.2s ease;
              align-text: center;
            }
          `}</style>
          <i className={`iconStyle-${name}`} {...rest} />
        </span>
      ) : (
        <img src={src} width={size} height={size} alt={name || "icon"} style={{ cursor: cursor }} className={className} {...rest} />
      )}
    </>
  );
};

export default CustomIcon;
