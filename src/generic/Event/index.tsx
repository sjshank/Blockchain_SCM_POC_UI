import React from "react";

type EventProps = {
  txRecords: any;
};

const EventComponent = ({ txRecords }: EventProps) => {
  const txURL = (tx: string) => {
    return `https://rinkeby.etherscan.io/tx/${tx}`;
  };
  return (
    <div>
      {txRecords && (
        <div className="history-tl-container">
          <ul className="tl">
            {txRecords.map((record: any) => (
              <li
                className="tl-item"
                key={record.txHash + "" + record.txMessage}
              >
                <div className="timestamp">{record.formattedTime}</div>
                <div className="item-title">{record.txMessage}</div>
                <div className="item-detail">
                  <a href={txURL(record.txHash)} target="_blank">
                    {record.txHash}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!txRecords && (
        <span style={{ textAlign: "center", padding: 10 }}>
          No updates available
        </span>
      )}
    </div>
  );
};

export default EventComponent;
