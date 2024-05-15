import { uTCCurrentDateTime } from "./getUTCDateTime";


export const helper : any = {
  
    stringCapitalize : (str:string) => {
      if(str) return str[0].toUpperCase() + str.slice(1).toLowerCase()
        else return str
    },

    toDateFormat : (date:string) => {
      let temp = new Date(date)
      let newDate = temp.getDate() < 10 ? `0${temp.getDate()}` : temp.getDate()
      let month = temp.getMonth() < 10 ? `0${temp.getMonth()}` : temp.getMonth()
      return `${newDate}-${month}-${temp.getFullYear()}`
    },
    dateConverter: (date : any = "") => {
      date = new Date(date)
      var hours = date.getHours();
      var minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      var am = hours >= 12 ? 'PM' : 'AM';
      var hour = hours % 12 || 12;
      var Hour = hour < 10 ? `0${hour}` : hour;
      return Hour + ':' + minutes + ' ' + am;
    },

    calcRemainingTime : (date:string):string => {
        const currentUTCDate : any = new Date(uTCCurrentDateTime) 
        // let curDate : any = currentUTCDate
        // console.log(currentUTCDate,'currentUTCDate')
        let propDate : any = new Date(date)
        // console.log(propDate,'propDate')
        let newDate : any = (propDate - currentUTCDate);
        if (newDate > 0) {
          let condate : any = new Date(newDate);
          let parseDate : any = "";
          let hours : any =
            condate.getUTCHours() < 10
              ? `0${condate.getUTCHours()}`
              : condate.getUTCHours();
          let minutes : any =
            condate.getUTCMinutes() < 10
              ? `0${condate.getUTCMinutes()}`
              : condate.getUTCMinutes();
          let seconds : any =
            condate.getUTCSeconds() < 10
              ? `0${condate.getUTCSeconds()}`
              : condate.getUTCSeconds();
          if (condate.getUTCDate() - 1 > 0) {
            parseDate = `${
              condate.getUTCDate() - 1
            }d: ${hours}h: ${minutes}m: ${seconds}s`;
          } else if (hours > 0) {
            parseDate = `${hours}h: ${minutes}m: ${seconds}s`;
          } else {
            parseDate = `${minutes}m : ${seconds}s`;
          }
          return parseDate;
        }else if(newDate < 0) {
          return "END";
        }else {
          return "LIVE";
        }
      },

      convert24to12 : (date:string) => {
        let newdate = new Date(date)
        let time = `${newdate.getHours()}:${newdate.getMinutes()}`
        if(time){
          let hours : any =
            Number(time.split(':')[0]) > 12
              ? Number(time.split(':')[0]) - 12
              : Number(time?.split(':')[0]) === 0
              ? 12
              : Number(time?.split(':')[0]);
          let minutes =
            Number(time.split(':')[1]) < 10
              ? `0${Number(time.split(':')[1])}`
              : Number(time.split(':')[1]);
          let meridian = Number(time.split(':')[0]) < 12 ? `AM` : `PM`;
          hours = Number(hours) < 10 ? "0"+Number(hours) : hours
          return `${hours}:${minutes} ${meridian}`;
        }
      },
    
};