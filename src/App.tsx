import React, { useEffect, useState } from 'react';
import TableComponent from './components/Table';
import './App.scss'

const App = () => {
  const [projects, setProjects] = useState<any[]>([]); 
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null); 

    fetch('https://raw.githubusercontent.com/saaslabsco/frontend-assignment/master/frontend-assignment.json')
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setTotalCount(data.length);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching projects: ' + error.message);         
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      id: "1",
      label: (
        <span className="d-flex align-items-center justify-content-center">
          S.No.
        </span>
      ),
      value: "index", 
      width: "20%",
      renderCell: (row: any) => (
        <div className="d-flex justify-content-center">{row["s.no"]}</div>
      ),
    },
    {
      id: "2",
      label: (
        <span className="d-flex align-items-center justify-content-center">
          Percentage Funded
        </span>
      ),
      value: "percentage_funded",
      width: "40%",
      renderCell: (row: any) => (
        <div className="d-flex justify-content-center">
          {row["percentage.funded"] || "-"}
        </div>
      ),
    },
    {
      id: "3",
      label: (
        <span className="d-flex align-items-center justify-content-center">
          Amount Pledged
        </span>
      ),
      value: "amount_pledged",
      width: "40%",
      renderCell: (row: any) => (
        <div className="d-flex justify-content-center">
          {row["amt.pledged"] ? `$${row["amt.pledged"].toLocaleString()}` : "-"}
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Project Table</h2>
      <div className="table-container">
        {error && <div className="error-message">{error}</div>}
        <TableComponent
          title="Projects"
          data={projects}
          columns={columns}
          loading={loading}
          totalCount={totalCount}
          isPagination={true}
        />
      </div>
    </div>
  );
};

export default App;
