import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchCompany } from '@/config/api';
import { ICompany } from '@/types/backend';

interface IState {
    isFetching: boolean;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: ICompany[]
}

interface IBackendRes<T> {
    data: T;
    message: string;
    statusCode: number;
}

interface IModelPaginate<T> {
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: T[];
}

// First, create the thunk
export const fetchCompany = createAsyncThunk(
    'company/fetchCompany',
    async ({ query }: { query: string }) => {
        const response = await callFetchCompany(query);
        return response;
    }
)


const initialState: IState = {
    isFetching: true,
    meta: {
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: []
};


export const companySlide = createSlice({
    name: 'company',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setActiveMenu: (state, action) => {
            // state.activeMenu = action.payload;
            console.log('API response:', action.payload.data);
        },


    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchCompany.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchCompany.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchCompany.fulfilled, (state, action) => {
            state.isFetching = false;
            if (action.payload && action.payload.data) {
                const responseData = action.payload.data as IModelPaginate<ICompany>;
                debugger;
                state.result = Array.isArray(responseData)
                    ? responseData
                    : [];
                state.meta = {
                    current: responseData.meta?.current ?? 1,
                    pageSize: responseData.meta?.pageSize ?? 10,
                    pages: responseData.meta?.pages ?? 0,
                    total: responseData.meta?.total ?? 0,
                };
            } else {
                state.result = [];
            }
        })
    },

});

export const {
    setActiveMenu,
} = companySlide.actions;

export default companySlide.reducer;
