import { useEffect, useRef, useState } from "react"

const useCountTime = (InsertTime) => {
    const InsertTimeDate = new Date(InsertTime).getTime();
    const [countTime, setCountTime] = useState(
        new Date().getTime() - InsertTimeDate
    )
    const result = useRef();

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 28;

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        if (countTime < month) {
            let isChoseTimeRange = false;

            const TimeRangeInit = new Date().getTime() - InsertTimeDate;
            if (!isChoseTimeRange && TimeRangeInit <= minute) {
                result.current = `Now`;
                isChoseTimeRange = true;
            }

            if (!isChoseTimeRange && TimeRangeInit <= hour) {
                const minuteRange = Math.floor(TimeRangeInit / (60 * 1000));
                result.current = `${minuteRange}m`;
                isChoseTimeRange = true;
            }

            if (!isChoseTimeRange && TimeRangeInit <= day) {
                const hourRange = Math.floor(TimeRangeInit / (60 * 60 * 1000));
                result.current = `${hourRange}h`;
                isChoseTimeRange = true;
            }

            if (!isChoseTimeRange && TimeRangeInit <= week) {
                const dateRange = Math.floor(TimeRangeInit / (24 * 60 * 60 * 1000));
                result.current = `${dateRange}d`;
                isChoseTimeRange = true;
            }

            if (!isChoseTimeRange && TimeRangeInit < month) {
                const weekRange = Math.floor(TimeRangeInit / (7 * 24 * 60 * 60 * 1000));
                result.current = `${weekRange}w`;
                isChoseTimeRange = true;
            }

            // Count
            let interval;
            let isChoseRangeCount = false;

            if (TimeRangeInit <= hour && !isChoseRangeCount) {
                isChoseRangeCount = true;
                interval = setInterval(() => {
                    const TimeRange = new Date().getTime() - InsertTimeDate;
                    setCountTime(TimeRange);
                }, 1000 * 60);
            }

            if (TimeRangeInit <= day && !isChoseRangeCount) {
                isChoseRangeCount = true;
                interval = setInterval(() => {
                    const TimeRange = new Date().getTime() - InsertTimeDate;
                    setCountTime(TimeRange);
                }, 60 * 60 * 1000);
            }
            return () => clearInterval(interval);
        } else {
            const inseartDate = new Date(InsertTime);
            const time = `${monthNames[inseartDate.getMonth()]} ${inseartDate.getDate()} ${inseartDate.getFullYear()}`
            result.current = time;
        }

    }, [countTime]);

    const timeStep = result.current;

    return [timeStep]
}

export { useCountTime }