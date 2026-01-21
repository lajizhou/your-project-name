/**
 * 模拟表格数据
 */
export const mockTableData = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟原始数据
      const originalData = [
        {
          name: "张芳",
          mgtOrgName: "国网四川成都锦江中心",
          userId: "062170001751478",
          ruleTriggered: "TY-QW-DL-SS-06",
          ruleName: "电能表本次示数小于上次示数",
          yearMonth: "2025-12",
          chkCalcPic: "H0003518258",
          position: "电力供应",
          department: "220V",
          thisMonthQty: "285888",
          lastMonthQty: "250966",
          lastMonusQty: "34922",
          lastMonthRate: "13.92%",
          abnormal: "1",
        },
        {
          name: "刘宇",
          mgtOrgName: "国网四川成都锦江中心",
          userId: "062170001751479",
          ruleName: "电能表本次示数小于上次示数",
          ruleTriggered: "TY-QW-DL-SS-06",
          yearMonth: "2025-12",
          chkCalcPic: "H0003518268",
          position: "电力供应",
          department: "380V",
          thisMonthQty: "0",
          lastMonthQty: "0",
          lastMonusQty: "0",
          lastMonthRate: "0%",
          abnormal: "1",
        },
        {
          name: "刘宇",
          mgtOrgName: "国网四川成都锦江中心",
          userId: "062170001751480",
          ruleName: "电能表本次示数小于上次示数",
          ruleTriggered: "TY-QW-DL-SS-06",
          yearMonth: "2025-12",
          chkCalcPic: "H0003518253",
          position: "电力生产",
          department: "380V",
          thisMonthQty: "26536",
          lastMonthQty: "20299",
          lastMonusQty: "6237",
          lastMonthRate: "30.73%",
          abnormal: "0",
        },
        {
          name: "张芳",
          mgtOrgName: "国网四川成都锦江中心",
          userId: "062170001751481",
          ruleName: "电能表本次示数小于上次示数",
          ruleTriggered: "TY-QW-DL-SS-06",
          yearMonth: "2025-12",
          chkCalcPic: "H0003518255",
          position: "电力生产",
          department: "220V",
          thisMonthQty: "58824",
          lastMonthQty: "49464",
          lastMonusQty: "9360",
          lastMonthRate: "18.92%",
          abnormal: "1",
        },
        {
          name: "张芳",
          mgtOrgName: "国网四川成都锦江中心",
          userId: "0306030002228832",
          ruleName: "工商业计量点费用类型缺失",
          ruleTriggered: "TY-QW-DF-SP-01",
          yearMonth: "2025-12",
          chkCalcPic: "H0003518255",
          position: "电力生产",
          department: "220V",
          thisMonthQty: "58824",
          lastMonthQty: "49464",
          lastMonusQty: "9360",
          lastMonthRate: "18.92%",
          abnormal: "0",
        },
        {
          name: "张芳",
          mgtOrgName: "国网四川成都锦江中心",
          userId: "0306030002228831",
          ruleName: "无抄见电量有基本电费",
          ruleTriggered: "JD_11",
          yearMonth: "2025-12",
          chkCalcPic: "H0003518255",
          position: "电力生产",
          department: "220V",
          thisMonthQty: "58824",
          lastMonthQty: "49464",
          lastMonusQty: "9360",
          lastMonthRate: "18.92%",
          abnormal: "1",
        },
        {
          name: "张芳",
          mgtOrgName: "国网四川成都锦江中心",
          userId: "0306030002228833",
          ruleName: "无抄见电量有基本电费",
          ruleTriggered: "JD_11",
          yearMonth: "2025-12",
          chkCalcPic: "H0003518255",
          position: "电力生产",
          department: "220V",
          thisMonthQty: "58824",
          lastMonthQty: "49464",
          lastMonusQty: "9360",
          lastMonthRate: "18.92%",
          abnormal: "1",
        },
        {
          name: "张芳",
          mgtOrgName: "国网四川成都锦江中心",
          userId: "0306030002228834",
          ruleName: "无抄见电量有基本电费",
          ruleTriggered: "JD_11",
          yearMonth: "2025-12",
          chkCalcPic: "H0003518255",
          position: "电力生产",
          department: "220V",
          thisMonthQty: "58824",
          lastMonthQty: "49464",
          lastMonusQty: "9360",
          lastMonthRate: "18.92%",
          abnormal: "0",
        },
      ];

      // 根据查询条件过滤数据
      let filteredData = [...originalData];

      if (params.userName) {
        filteredData = filteredData.filter((item) =>
          item.name.includes(params.userName)
        );
      }

      if (params.userId) {
        filteredData = filteredData.filter((item) =>
          item.userId.includes(params.userId)
        );
      }

      if (params.voltageLevel) {
        filteredData = filteredData.filter(
          (item) => item.department === params.voltageLevel
        );
      }

      // 分页
      const start = (params.page - 1) * params.size;
      const end = start + params.size;
      const pagedData = filteredData.slice(start, end);

      resolve({
        data: pagedData,
        total: filteredData.length,
      });
    }, 300); // 模拟网络延迟
  });
};
