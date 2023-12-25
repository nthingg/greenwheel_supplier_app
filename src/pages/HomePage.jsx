import "../assets/scss/home.scss";
import Widget from "../components/Widget";
import Featured from "../components/Featured";
import Chart from "../components/Chart";
import Table from "../components/Table";

const HomePage = () => {
  return (
    <div className="home">
      <div className="home_container">
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={3 / 1} />
        </div>
        <div className="list_container">
          <div className="list_title">Latest Transaction</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
