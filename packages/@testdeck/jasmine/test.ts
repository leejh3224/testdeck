import { assert } from "chai";
import { retries, slow, suite, test, timeout } from "./index";

describe("tests", function() {

    let events: string[];

    @suite class Suite {
        public static before() {
            events.push("Suite statc before");
        }

        public before() {
            events.push("Suite before");
        }

        @test(timeout(1000), slow(500), retries(3))
        public test() {
            events.push("Suite test");
        }

        @test.pending(timeout(1000)) public pendingTest() {
            events.push("Suite pendingTest");
        }

        @test.skip(slow(500)) public skippedTest() {
            events.push("Suite skippedTest");
        }

        public after() {
            events.push("Suite after");
        }

        public static after() {
            events.push("Suite statc after");
        }
    }

    @suite class CallbacksSuite {
        public static before(done) {
            events.push("CallbacksSuite statc before");
            setTimeout(done, 0);
        }

        public before(done) {
            events.push("CallbacksSuite before");
            setTimeout(done, 0);
        }

        @test(timeout(1000), slow(500), retries(3))
        public test(done) {
            events.push("CallbacksSuite test");
            setTimeout(done, 0);
        }

        @test
        @timeout(100)
        public test2(done) {
            events.push("CallbacksSuite test2");
            setTimeout(done, 1);
        }

        @test
        @retries(100)
        public test3(done) {
            events.push("CallbacksSuite test3");
            setTimeout(done, 1);
        }

        @test.pending(timeout(1000))
        public pendingTest(done) {
            events.push("CallbacksSuite pendingTest");
            setTimeout(done, 0);
        }

        @test.skip(slow(500))
        public skippedTest(done) {
            events.push("CallbacksSuite skippedTest");
            setTimeout(done, 0);
        }

        public after(done) {
            events.push("CallbacksSuite after");
            setTimeout(done, 0);
        }

        public static after(done) {
            events.push("CallbacksSuite static after");
            setTimeout(done, 0);
        }
    }

    @suite.pending class PendintSuite {
        @test public test() {
            events.push("PendintSuite test");
        }
    }

    @suite.skip class SkippedSuite {
        @test public test() {
            events.push("SkippedSuite test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    afterAll(function() {
        assert.deepEqual(events, [
            "Suite statc before",
            "Suite before",
            "Suite test",
            "Suite after",
            "Suite statc after",
            "CallbacksSuite statc before",
            "CallbacksSuite before",
            "CallbacksSuite test",
            "CallbacksSuite after",
            "CallbacksSuite before",
            "CallbacksSuite test2",
            "CallbacksSuite after",
            "CallbacksSuite before",
            "CallbacksSuite test3",
            "CallbacksSuite after",
            "CallbacksSuite static after",
            "FAIL PLEASE!!!"
        ]);
        events = undefined;
    });
});