<template>
    <van-nav-bar left-arrow safe-area-inset-top title="详情" @click-left="$router.back">
        <template #right>
            <van-icon name="delete-o" size="22" />
        </template>
    </van-nav-bar>
    <div class="w-full flex flex-col items-center mt-8">
        <div class="w-11/12 px-4 pt-4 box-border relative" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
            <div class="flex items-center">
                <svg-icon color="black" size="2rem" :name="accountDetailType?.icon || ''" />
                <span class="ml-4">{{ accountDetailType?.name || '' }}</span>
                <span class="ml-auto mr-0">
                    <span v-if="account?.type === 1">-</span>
                    <span>{{ account?.account_number }}</span>
                </span>
            </div>

            <div class="w-full mt-4">
                <span>{{ account?.description }}</span>
            </div>

            <div class="mt-8 flex text-xs">
                <span v-if="account?.type === 1">付款成员</span>
                <span v-else-if="account?.type === 0">收款成员</span>
                <span class="ml-auto mr-0">{{ familyMemberList.join(',') }}</span>
            </div>
            <div class="mt-2 flex text-xs">
                <span>记账时间</span>
                <span class="ml-auto mr-0">{{ formatDateTime(account?.created_time) }}</span>
            </div>
            <div class="mt-2 flex text-xs">
                <span>资金账户</span>
                <span class="ml-auto mr-0">{{ accountType?.name }}</span>
            </div>

            <div class="w-3/5 mx-auto">
                <van-button class="translate-y-1/2" round size="large" type="warning">编辑</van-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Account } from '@/entity/Account';
import { useRoute } from 'vue-router';
import { useAccount } from '@/stores/account';
import { indexdbUtil } from '@/model';
import { AccountFamilyMember } from '@/entity/AccountFamilyMember';
import { ref } from 'vue';
import type { AccountDetailType } from '@/entity/AccountDetailType';
import type { AccountType } from '@/entity/AccountType';
import { formatDateTime } from '@/util/date';

const route = useRoute()
const accountStore = useAccount()
const account = ref<Account | null>(null)
const accountType = ref<AccountType | null | undefined>(null)
const accountDetailType = ref<AccountDetailType | null | undefined>(null)
const familyMemberList = ref<string[]>([])
if (route.query.id && typeof route.query.id === 'string') {
    const accountId = Number(route.query.id)
    indexdbUtil.manager.findOne(Account, {
        where: {
            id: accountId
        }
    }).then(async (data) => {
        if (!data) {
            return;
        }
        account.value = data
        familyMemberList.value = (await indexdbUtil.manager.find(AccountFamilyMember, {
            where: {
                account_id: accountId
            }
        })).map(i => {
            const familyMember = accountStore.familymembetList.find(f => f.id === i.familymember_id)
            return familyMember?.name || ''
        })
        accountDetailType.value = accountStore.incomeTypeList.concat(accountStore.spendTypeList).find(i => i.id === data.detail_type_id)
        accountType.value = accountStore.accountTypeList.find(i => data.account_type_id === i.id)
    })
}
</script>

<style scoped>

</style>