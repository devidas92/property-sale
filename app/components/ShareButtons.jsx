"use client";

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const ShareButtons = ({ property, showLabels = false }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;

  const buttons = [
    {
      Component: FacebookShareButton,
      Icon: FacebookIcon,
      label: "Facebook",
      props: { url: shareUrl, quote: property.name, hashtag: "#property" },
    },
    {
      Component: TwitterShareButton,
      Icon: TwitterIcon,
      label: "Twitter",
      props: { url: shareUrl, title: property.name },
    },
    {
      Component: WhatsappShareButton,
      Icon: WhatsappIcon,
      label: "WhatsApp",
      props: { url: shareUrl, title: property.name, separator: ":: " },
    },
    {
      Component: EmailShareButton,
      Icon: EmailIcon,
      label: "Email",
      props: { url: shareUrl, subject: property.name, body: "Check this out!" },
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Share this property
      </h3>
      <div className="flex flex-wrap items-center gap-4">
        {buttons.map(({ Component, Icon, label, props }, index) => (
          <div key={index} className="flex flex-col items-center group">
            <Component {...props}>
              <Icon
                size={48}
                round
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </Component>
            {showLabels && (
              <span className="text-sm text-gray-600 mt-1 group-hover:text-black transition-colors">
                {label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShareButtons;
