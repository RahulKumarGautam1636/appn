// Using just to break cycle imports and its warnings from compiler.

export const getRequiredFields = (list=[]) => {
  // let { globalData } = store.getState();

  return list.map((i: any) => ({ 
    PTR: i.PTR,
    AutoId: i.AutoId,
    Category: i.Category, 
    CategoryName: i.CategoryName, 
    SubCategoryId: i.SubCategoryId,
    CompanyId: i.CompanyId,
    Description: i.Description, 
    DepartmentId: i.DepartmentId,
    Discount: i.Discount,
    DiscountPer: i.DiscountPer,
    EXPDate: i.EXPDate,
    ItemId: i.ItemId, 
    ItemMRP: i.ItemMRP, 
    PackSizeId: i.PackSizeId,
    ItemPackSizeList: i.ItemPackSizeList, 
    SRate: i.SRate, 
    StockQty: i.StockQty, 
    GroupName: i.GroupName, 
    Parent: i.Parent, 
    ParentDesc: i.ParentDesc, 
    Technicalname: i.Technicalname,
    sv_CostId: i.sv_CostId, 
    itemmstr: i.itemmstr, 
    LocationId: i.LocationId, 
    ManufacturBY: i.ManufacturBY,
    Unit: i.Unit,
    UnitName: i.UnitName,
    IsVisible: i.IsVisible, 
    ItemCode: i.ItemCode, 
    ItemImageURL: i.ItemImageURL,    
    CGST: i.CGST,
    SGST: i.SGST,
    IGST: i.IGST, 
    CGSTRATE: i.CGSTRATE, 
    SGSTRATE: i.SGSTRATE,
    IGSTRATE: i.IGSTRATE, 
    Specification: i.Specification || '', 

    LocationName: i.LocationName || '',
    LocationItemId: i.LocationItemId,
    count: 1,
  }));
}

export const getCategoryRequiredFieldsOnly = (list) => {

  return list.map(i => ({ 
    Parent: i.Parent,
    ParentDesc: i.ParentDesc,
    Text: i.ParentDesc,
    Value: String(i.Parent),
    ImageURL: i.ImageURL
  }));
}