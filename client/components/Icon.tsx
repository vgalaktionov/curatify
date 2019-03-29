import * as React from "react";

interface iconProps {
  icon: string;
  size?: string;
}

export default ({ icon, size }: iconProps) => {
  return (
    <span className="icon">
      <i className={icon} />
    </span>
  );
};
