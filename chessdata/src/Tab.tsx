import React from "react";

type TabProps = {
  title: string;
  children: React.ReactNode;
};

const Tab: React.FC<TabProps> = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
export default Tab;
