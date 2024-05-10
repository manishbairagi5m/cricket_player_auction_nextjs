import React, { useEffect, useRef, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import AccordionButton from "react-bootstrap/AccordionButton";
import CustomTextfield from "@/Components/StyledComponents/CustomTextfields";
import { IoSearch } from "react-icons/io5";
import CustomSelect from "@/Components/StyledComponents/CustomSelect";
import {
  addWatchlist,
  getAuctionList,
  getCategoryList,
  getMakeInList,
  placeABid,
  removeWatchlist,
} from "@/customApi/auction";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import ProductCard from "@/Components/StyledComponents/ProductCard";
import PlaceBidModal from "@/Components/Home/PlaceBidModal";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal } from "@/lib/slice/modalsSlice";
import { useRouter, useSearchParams } from "next/navigation";
import SubHeader from "@/Components/StyledComponents/SubHeader";
import Slider from '@mui/material/Slider';

interface IAppProps {}

export const CustomAccordian: React.FC<any> = ({
  children,
  header,
  eventKey,
}: any) => {
  return (
    <Accordion.Item eventKey={eventKey} className="mb-3">
      <AccordionButton className="category-accordian-header">
        {header}
      </AccordionButton>
      <Accordion.Body className="category-accordian-body">
        {children}
      </Accordion.Body>
    </Accordion.Item>
  );
};

let initialPrize = { min: 0, max: 100000 };


export default function AuctionList(props: IAppProps) {
  const [categoryList, setCategoryList] = useState([]);
  const [makeInList, setmakeInList] = useState([]);
  const [auctionList, setAuctionList] = useState([]);
  const [updateData, setUpdateData] = useState<any>([]);
  const [category, setCategory] = useState("");
  const [auctionType, setAuctionType] = useState("");
  const [makeType, setMakeType] = useState("");
  const [occasion, setOccasion] = useState("");
  const heightRef: any = useRef(null);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const { data: session }: any = useSession();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [placeBidModal, setPlaceBidModal] = useState<any>({
    modal: false,
    data: null,
  });
  const [minVal, setMinVal] = useState(initialPrize.min);
  const [maxVal, setMaxVal] = useState(initialPrize.max);
  const searchParams = useSearchParams();
  const router: any = useRouter();
  const categoryParam: any = searchParams.get("category");
  const auctionParam: any = searchParams.get("type");
  const makeInParam: any = searchParams.get("makein");
  const statedata = useSelector((state:any)=> state.auctions)
  

// console.log(statedata,'statedata')
  let auction_types = [
    { label: "Live", value: "ACTIVE" },
    { label: "Upcoming", value: "UPCOMING" },
  ];
  let occasions = [
    { label: "Weddings", value: "Weddings" },
    { label: "Formal Events", value: "Formal_Events" },
    { label: "Parties", value: "Parties" },
    { label: "Religious Ceremonies", value: "Religious_Ceremonies" },
    { label: "Casual Outings", value: "Casual_Outings" },
    { label: "Gift Giving", value: "Gift_Giving" },
    { label: "Other", value: "Other" },
  ];
  let sortItems = [
    { label: "All", value: "" },
    { label: "A to Z", value: "atoz" },
    { label: "Z to A", value: "ztoa" },
  ];

  useEffect(() => {
    if(auctionType==="ACTIVE"){
      setAuctionList(statedata.liveAuction)
    }else if(auctionType==="UPCOMING"){
      setAuctionList(statedata.upcomingAuction)
    }else{
      setAuctionList(statedata.auctionList)
    }
    if(auctionParam){
      handleReset(false,false)
    }else{
      handleReset(false,true)
    }
  }, [statedata])
  

  // search params query filters
  useEffect(() => {
    if (categoryParam) {
      setCategory(categoryParam);
      getAuctionListData({ name: categoryParam });
    } else if (auctionParam) {
      setAuctionType(auctionParam);
      getAuctionListData({ status: auctionParam });
    } else if (makeInParam) {
      setMakeType(makeInParam);
      getAuctionListData({ make: makeInParam });
    } else {
      getAuctionListData();
    }
  }, []);

  const handleReset = (apiCall:boolean,allreset:boolean) => {
    if(allreset){
      setAuctionType("");
      router.replace("/auction-list", { scroll: false });
    }
    setMinVal(initialPrize.min);
    setMaxVal(initialPrize.max);
    setCategory("");
    setOccasion("");
    setSort("");
    setSearch("");
    setMakeType("");
    if(apiCall){
      getAuctionListData();
    }
  };

  const handleFilter = () => {
    let params: any = {};
    if (category) params.name = category;
    params.price = JSON.stringify({min:Number(minVal),max:Number(maxVal)});
    if (auctionType) params.status = auctionType;
    if (occasion) params.occasion = occasion;
    if (sort) params.sort = sort;
    if (search) params.search = search;
    if (makeType) params.make = makeType;
    getAuctionListData(params);
  };

  const getAuctionListData = async (filter?: any) => {
    let params: any = {};
    if (filter) params = filter;
    if (session?.user?._id) params.user_id = session.user._id;
    await getAuctionList(params)
      .then((res: any) => {
        if (res?.status) {
          setAuctionList(res.data);
        } else {
          toast.error(res.message);
        }
      })
      .catch((err: any) => {
        console.log(err, "err");
      });
  };

  const handlePlaceBid = (data: any) => {
    if (session?.user) {
      setPlaceBidModal({ modal: true, data: data });
    } else {
      toast.error("Please Login first...");
      dispatch(setLoginModal(true));
    }
  };

  const RemoveToWatchList = async (auction_id: string) => {
    await removeWatchlist(auction_id)
      .then((res: any) => {
        if (res?.status) {
          toast.success(res.message);
          getAuctionListData();
        } else {
          toast.error(res.message);
        }
      })
      .catch((err: any) => {
        console.log(err, "err");
      });
  };

  const AddToWatchList = async (auction_id: string) => {
    let params = { auction_id: auction_id };
    await addWatchlist(params)
      .then((res: any) => {
        if (res?.status) {
          toast.success(res.message);
          getAuctionListData();
        } else {
          if (res.code === 401) {
            toast.error("Please Login first...");
            dispatch(setLoginModal(true));
          } else {
            toast.error(res.message);
          }
        }
      })
      .catch((err: any) => {
        console.log(err, "err");
      });
  };

  const placeBid = async (data: any) => {
    await placeABid(data)
      .then((res) => {
        if (res?.status) {
          toast.success(res.message);
          setPlaceBidModal({ modal: false, data: null });
          // getAuctionListData();
        } else {
          toast.error(res.message);
        }
      })
      .catch((err: any) => {
        console.log(err, "err");
      });
  };

  const getCategoryListData = async () => {
    await getCategoryList()
      .then((res) => {
        if (res?.status) {
          setCategoryList(res.data);
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  useEffect(() => {
    getCategoryListData();
  }, []);

  const getMakeInListData = async () => {
    await getMakeInList()
      .then((res) => {
        if (res?.status) {
          setmakeInList(res.data);
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  useEffect(() => {
    getMakeInListData();
  }, []);

  // render page every second 
  useEffect(() => {
    const interval: any = setInterval(() => {
      if (auctionList) setUpdateData([...auctionList]);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [auctionList]);

  const handlePriceInput = (e:any)=> {
    const {name,value} = e.target
    if(name==='minVal'){
      if(value>=initialPrize.min && value<=initialPrize.max && value<maxVal) setMinVal(value || 0)
      }else{
      if(value>=initialPrize.min && value<=initialPrize.max && value>minVal) setMaxVal(value)
    }
  }

  const handlePriceFilter = (e:any,val: any) => {
    if(val){
      setMinVal(val[0])
      setMaxVal(val[1])
    }
  };

  function valueLabelFormat(value: number) {
    let scaledValue = value;
    if(scaledValue>=1000000){
      let val = String(scaledValue/1000000).includes(".") ? (scaledValue/1000000).toFixed(2) : scaledValue/1000000
      return `${val}M`;
    }else if(scaledValue>=1000){
      let val = String(scaledValue/1000).includes(".") ? (scaledValue/1000).toFixed(2) : scaledValue/1000
      return `${val}K`;
    }else{
      return `${scaledValue}`;
    }
  }

  return (
    <div className="container">
      <SubHeader arr={[{ label: "Auction List", path: "auction-list" }]} />

      <div className="row my-5">
        <div
          className="col-md-4"
          style={{ height: "fit-content" }}
          ref={heightRef}
        >
          <Accordion
            defaultActiveKey={[
              !categoryParam && !auctionParam ? "0" : "false",
              categoryParam ? "1" : "false",
              "false",
              auctionParam ? "3" : "false",
            ]}
            className="category-accordian mb-4"
            data-bs-theme="dark"
          >
            <CustomAccordian eventKey="0" header="Make in">
              <ul>
                {makeInList &&
                  Array.isArray(makeInList) &&
                  makeInList.length > 0 &&
                  makeInList.map((item: any, i: number) => (
                    <li
                      key={i}
                      className="d-flex align-items-center gap-2 text-capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={item.name === makeType}
                        value={item.name}
                        onChange={(e) =>
                          setMakeType(e.target.checked ? e.target.value : "")
                        }
                      />
                      {item.name}
                    </li>
                  ))}
              </ul>
            </CustomAccordian>
            <CustomAccordian eventKey="1" header="Category">
              <ul>
                {categoryList &&
                  Array.isArray(categoryList) &&
                  categoryList.length > 0 &&
                  categoryList.map((item: any, i: number) => (
                    <li
                      key={i}
                      className="d-flex align-items-center gap-2 text-capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={item.name === category}
                        value={item.name}
                        onChange={(e) =>
                          setCategory(e.target.checked ? e.target.value : "")
                        }
                      />
                      {item.name}
                    </li>
                  ))}
              </ul>
            </CustomAccordian>
            <CustomAccordian eventKey="2" header="Price">
              <Slider
                getAriaLabel={() => 'Temperature range'}
                value={[minVal,maxVal]}
                className="mt-4"
                onChange={handlePriceFilter}
                valueLabelDisplay="auto"
                min={initialPrize.min}
                max={initialPrize.max}
                valueLabelFormat={valueLabelFormat}
                disableSwap
                sx={{
                  color: '#fff',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#fff',
                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                      boxShadow: 'none',
                    },
                  },
                  '& .MuiSlider-valueLabel': {
                    lineHeight: 1,
                    padding: '6px',
                    borderRadius: '5px',
                    fontWeight:"700",
                    color:'#47243C',
                    transition:'0.5s all ease',
                    backgroundColor: '#fff',
                  },
                }}
              />
              <div className="d-flex justify-content-between align-items-center mt-1">
                <span>AED <input value={minVal} name="minVal" onChange={handlePriceInput} 
                size={String(minVal).length>1 ? String(minVal).length-1 : String(minVal).length}
                className="transparent-input"/></span>
                <span className="d-flex justify-content-end"> AED 
                <input value={maxVal} name="maxVal" 
                onChange={handlePriceInput} size={String(maxVal).length>1 ? String(maxVal).length-1 : String(maxVal).length} className="transparent-input text-end" /></span>
              </div>
            </CustomAccordian>
            <CustomAccordian eventKey="3" header="Auction type">
              <ul>
                {auction_types.map((item: any, i: number) => (
                  <li key={i} className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.value === auctionType}
                      value={item.value}
                      onChange={(e) =>
                        setAuctionType(e.target.checked ? e.target.value : "")
                      }
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
            </CustomAccordian>
            <CustomAccordian eventKey="4" header="Occasion">
              <ul>
                {occasions.map((item: any, i: number) => (
                  <li key={i} className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.value === occasion}
                      value={item.value}
                      onChange={(e) =>
                        setOccasion(e.target.checked ? e.target.value : "")
                      }
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
            </CustomAccordian>
          </Accordion>
        </div>
        <div
          className="col-md-8 overflow-auto"
          //  style={{height:`${heightRef?.current?.offsetHeight}px` || 'auto'}}
        >
          <div
            className="row main-border p-2 px-3 rounded text-white"
            style={{ margin: "0 1px",backgroundColor:"#47243C" }}
          >
            <div className="col-md-3 p-0 d-flex align-items-center gap-2 text-nowrap my-3 my-md-0">
              Sort by
              <CustomSelect
                name="sort"
                value={sort}
                onChange={(e: any) => setSort(e.target.value)}
                itemList={sortItems}
              />
            </div>
            <div className="col-md-3"></div>
            <div className="d-flex justify-content-center col-md-3 text-white">
              <CustomTextfield
                placeHolder="Item name..."
                Icon={IoSearch}
                value={search}
                inputClassName="text-white"
                onChange={(e: any) => setSearch(e.target.value)}
                IconDirectionRight={true}
              />
            </div>
            <div className="col-md-3 d-flex align-items-center justify-content-center gap-2 p-0 my-3 my-md-0">
              <button
                className="button-with-icon-shadow w-50 justify-content-center "
                onClick={() => handleReset(true,true)}
              >
                Reset
              </button>
              <button
                className="button-with-icon-shadow w-50 justify-content-center "
                onClick={() => handleFilter()}
              >
                Apply
              </button>
            </div>
          </div>

          {/* auction list  */}
          <div className="row mt-4">
            {(auctionList &&
              Array.isArray(auctionList) &&
              auctionList.length > 0 &&
              auctionList.map((item: any, index: number) => (
                <div
                  className="col-md-6 mb-4"
                  key={item._id}
                  data-aos={item.aos}
                  data-aos-duration="1200"
                >
                  <ProductCard
                    item={item}
                    handlePlaceBid={handlePlaceBid}
                    AddToWatchList={AddToWatchList}
                    RemoveToWatchList={RemoveToWatchList}
                  />
                </div>
              ))) || (
              <div className="text-center">
                Auctions not available
              </div>
            )}
          </div>
        </div>
      </div>

      <PlaceBidModal
        placeBidModal={placeBidModal}
        setPlaceBidModal={setPlaceBidModal}
        placeBid={placeBid}
        loading={loading}
      />
    </div>
  );
}
