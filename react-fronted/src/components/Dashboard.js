import React, { Component, useEffect, useState } from "react";
import "./Dashboard.css";
import AddShoppingCartRoundedIcon from "@material-ui/icons/AddShoppingCartRounded";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { Box, Button } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import Rating from "@material-ui/lab/Rating";
import book from "../assests/book.png";
import book1 from "../assests/book.png";
import book2 from "../assests/book.png";
import book3 from "../assests/book.png";
import Icon from "@material-ui/core/Icon";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "100%",
    height: "100%",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  paginator: {
    justifyContent: "center",
    padding: "10px",
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();
  const [result, setResult] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const history = useHistory();
  const location = useLocation();
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState();

  const [noOfPages, setNoOfPages] = useState(
    Math.ceil(result.length / itemsPerPage)
  );

  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (searchValue.length == 0) {
      fetch(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/books8f8fe52.json"
      )
        .then((res) => res.json())
        .then(
          (res) => {
            console.log("Result ==> ", res[0]);

            let tempRes = res.sort((w1, w2) => {
              if (
                parseFloat(w1.average_rating) < parseFloat(w2.average_rating)
              ) {
                return 1;
              }
              return -1;
            });

            setResult(tempRes);

            setNoOfPages(Math.ceil(res.length / itemsPerPage));
          },

          (error) => {
            console.log(error);
          }
        );
    }
  }, [searchValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    let temp = e.target.value;
    setSearchValue(temp);
  };

  const onSearch = (e) => {
    e.preventDefault();
    let a = [];

    for (let i = 0; i < result.length; i++) {
      let x = result[i];
      if (
        typeof x.title == "string" &&
        (x.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          x.authors.toLowerCase().includes(searchValue.toLowerCase()))
      ) {
        a.push(result[i]);
      }
    }

    setSearch(a);
    let page = Math.ceil(search.length / itemsPerPage);
    if (page > 0) {
      setNoOfPages(Math.ceil(search.length / itemsPerPage));
    } else {
      setNoOfPages(1);
    }

    console.log(a);
  };

  const handleTotal = () => {
    let x = 0;
    for (let j = 0; j < items.length; j++) {
      for (let i = 0; i < result.length; i++) {
        if (result[i].bookID == items[j]) {
          x += result[i].price;
        }
      }
    }
    setTotalPrice(x);
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="name col-sm">
          <a className="navbar-brand" href="#">
            Books Store
          </a>
        </div>
        <div className="col-sm-7">
          <div className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(e) => handleSearch(e)}
            ></input>
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
              onClick={(e) => onSearch(e)}
            >
              Search
            </button>
          </div>
        </div>
        <div className="col-sm ">
          <div className="cart">
            <AddShoppingCartRoundedIcon
              onClick={() => {
                history.push({
                  pathname: "/checkout",
                  state: {
                    data: totalPrice,
                  },
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className={classes.root}>
        <GridList cellHeight={180} spacing={10} className={classes.gridList}>
          <GridListTile key="Subheader" cols={5} style={{ height: "auto" }}>
            <ListSubheader component="div">Books Available</ListSubheader>
          </GridListTile>
          {searchValue.length == 0 &&
            result.length > 0 &&
            result
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((tile, i) => (
                <GridListTile key={tile.bookID}>
                  {i % 2 == 0 && <img src={book} alt={tile.title} />}
                  {i % 3 == 0 && <img src={book1} alt={tile.title} />}
                  {i % 4 == 0 && <img src={book2} alt={tile.title} />}
                  {i % 1 == 0 && <img src={book3} alt={tile.title} />}
                  <GridListTileBar
                    title={tile.title}
                    subtitle={
                      <div className="details">
                        <div>by: {tile.authors} </div>
                        <div>
                          <Rating
                            name="read-only"
                            value={tile.average_rating}
                            readOnly
                          />
                        </div>
                        <div className="row price">
                          <div className="col-sm">Price: {tile.price}</div>
                        </div>
                      </div>
                    }
                    actionIcon={
                      <Button
                        variant="contained"
                        color="primary"
                        className="btnadd"
                        onClick={() => {
                          let a = items;
                          a.push(tile.bookID);
                          setItems(a);
                          handleTotal();
                        }}
                      >
                        <span className="add">+</span>
                      </Button>
                    }
                  />
                </GridListTile>
              ))}
          {search.length > 0 &&
            search
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((tile, i) => (
                <GridListTile key={tile.bookID}>
                  {i % 2 == 0 && <img src={book} alt={tile.title} />}
                  {i % 3 == 0 && <img src={book1} alt={tile.title} />}
                  {i % 4 == 0 && <img src={book2} alt={tile.title} />}
                  {i % 1 == 0 && <img src={book3} alt={tile.title} />}
                  <GridListTileBar
                    title={tile.title}
                    subtitle={
                      <div className="details">
                        <div>by: {tile.authors} </div>
                        <div>
                          <Rating
                            name="read-only"
                            value={tile.average_rating}
                            readOnly
                          />
                        </div>
                        <div className="row price">
                          <div className="col-sm">Price: {tile.price}</div>
                        </div>
                      </div>
                    }
                    actionIcon={
                      <Button
                        variant="contained"
                        color="primary"
                        className="btnadd"
                        onClick={() => {
                          let a = items;
                          a.push(tile.bookID);
                          setItems(a);
                          handleTotal();
                        }}
                      >
                        <span className="add">+</span>
                      </Button>
                    }
                  />
                </GridListTile>
              ))}
        </GridList>
      </div>

      <Box component="span">
        <Pagination
          count={noOfPages}
          page={page}
          onChange={handleChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          classes={{ ul: classes.paginator }}
        />
      </Box>
    </div>
  );
};

export default Dashboard;
