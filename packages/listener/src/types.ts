export interface TransactionsResult {
  data: Transaction[];
  success: boolean;
  meta: Meta;
}

export interface Transaction {
  ret: Ret[];
  signature: string[];
  txID: string;
  net_usage: number;
  raw_data_hex: string;
  net_fee: number;
  energy_usage: number;
  block_timestamp: string;
  blockNumber: string;
  energy_fee: number;
  energy_usage_total: number;
  raw_data: RawData;
  internal_transactions: any[];
}

export interface RawData {
  contract: Contract[];
  ref_block_bytes: string;
  ref_block_hash: string;
  expiration: number;
  fee_limit: number;
  timestamp: number;
}

export interface Contract {
  parameter: Parameter;
  type: string;
}

export interface Parameter {
  value: Value;
  type_url: string;
}

export interface Value {
  data?: string;
  owner_address: string;
  contract_address?: string;
  new_contract?: NewContract;
}

export interface NewContract {
  bytecode: string;
  consume_user_resource_percent: number;
  name: string;
  origin_address: string;
  abi: ABI;
  origin_energy_limit: number;
}

export interface ABI {
  entrys: Entry[];
}

export interface Entry {
  inputs?: Put[];
  name: string;
  stateMutability: StateMutability;
  type: Type;
  outputs?: Put[];
}

export interface Put {
  name?: string;
  type: string;
}

export enum StateMutability {
  Nonpayable = 'Nonpayable',
  View = 'View'
}

export enum Type {
  Function = 'Function'
}

export interface Ret {
  contractRet: string;
}

export interface Meta {
  at: number;
  page_size: number;
}
