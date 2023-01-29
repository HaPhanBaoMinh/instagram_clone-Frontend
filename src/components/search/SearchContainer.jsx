import React, { useRef, useState } from 'react'
import { AiOutlineCloseCircle, AiOutlineSearch } from 'react-icons/ai'
import { BsSearch } from 'react-icons/bs'
import instanceAxios from '../../api/axiosConfig';
import Loading from '../loading/Loading';
import SearchItem from './SearchItem';
import { v4 as uuidv4 } from 'uuid';

function SearchContainer({ onClickSearch }) {
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);

    const onResetSearch = () => {
        setSearch("");
        setSearchResult([]);
    }

    const onSearchInput = async (value) => {
        setSearch(value);
        setIsLoading(true);
        const result = await instanceAxios.get(`/user/search?value=${value}`);
        if (result.data.status) {
            setIsLoading(false);
            setSearchResult(result.data.result)
        }
    }

    return (
        <div className='w-[400px] overflow-hidden border rounded-tr-2xl rounded-br-2xl h-full bg-white absolute top-0 xl:left-[100%] md:left-[75px] shadow-[20px_-1px_20px_-20px_rgb(0,0,0,0.25);]	'>
            <div className='border-b w-full h-[150px] px-4'>
                <h2 className='py-4 font-medium text-2xl'>Search</h2>
                <div className='w-full bg-[#efefef] rounded-md px-3 flex items-center h-10'>
                    {search.length === 0 ? <BsSearch className='w-[10%] text-sm text-[#9ca3af]' /> : undefined}
                    <input type="text" value={search} onChange={e => onSearchInput(e.target.value)} className='w-[90%] h-7 leading-7 pl-1 outline-none border-none bg-inherit rounded-md' placeholder='Search' />
                    {search.length !== 0 && !isLoading ? <AiOutlineCloseCircle onClick={onResetSearch} className='w-[10%] text-lg cursor-pointer text-[#9ca3af]' /> : undefined}
                    {search.length !== 0 && isLoading ?
                        <div className='w-[10%] h-full'>
                            <Loading />
                        </div> : undefined}
                </div>
            </div>

            <div className='w-full'>
                <h2 className='p-4 font-medium text-lg'>Recent</h2>
                {searchResult ? searchResult.map(result => <SearchItem onClick={onClickSearch} key={uuidv4()} result={result} />) : undefined}
            </div>
        </div>
    )
}

export default SearchContainer