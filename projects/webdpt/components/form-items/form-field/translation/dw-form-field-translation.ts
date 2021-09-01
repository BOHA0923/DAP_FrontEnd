export interface Itranslation {
    '最大長度': string;
    '最小長度': string;
    '驗證不通過': string;
    '請輸入正確信箱': string;
    '必填': string;
    '最大數字': string;
    '最小數字': string;
    '小數位數': string;
    '選擇日期': string;
    '選擇開始日期': string;
    '選擇結束日期': string;
}
const en: Itranslation = {
    '最大長度': 'max length:{{$0}}',
    '最小長度': 'min length:{{$0}}',
    '驗證不通過': 'not valid',
    '請輸入正確信箱': 'not correct email',
    '必填': 'required',
    '最大數字': 'max number:{{$0}} ',
    '最小數字': 'min number:{{$0}} ',
    '小數位數': 'The number of decimal places is up to {{$0}}',
    '選擇日期': 'select date',
    '選擇開始日期': 'Select start date',
    '選擇結束日期': 'Select end date'
};
const tw: Itranslation = {
    '最大長度': '最大長度:{{$0}}',
    '最小長度': '最小長度:{{$0}}',
    '驗證不通過': '驗證不通過',
    '請輸入正確信箱': '請輸入正確信箱',
    '必填': '必填',
    '最大數字': '最大數字:{{$0}}',
    '最小數字': '最小數字:{{$0}} ',
    '小數位數': '小數位數最多{{$0}}位',
    '選擇日期': '選擇日期',
    '選擇開始日期': '選擇開始日期',
    '選擇結束日期': '選擇結束日期'
};
const cn: Itranslation = {
    '最大長度': '最大长度:{{$0}}',
    '最小長度': '最小长度:{{$0}}',
    '驗證不通過': '验证不通过',
    '請輸入正確信箱': '请输入正确信箱',
    '必填': '必填',
    '最大數字': '最大数字:{{$0}}',
    '最小數字': '最小数字:{{$0}} ',
    '小數位數': '小数位数最多{{$0}}位',
    '選擇日期': '选择日期',
    '選擇開始日期': '选择开始日期',
    '選擇結束日期': '选择结束日期'
};
export { en, tw, cn };
